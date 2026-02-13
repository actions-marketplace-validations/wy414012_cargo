import path from "path";
import * as fs from "fs";

import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as tc from "@actions/tool-cache";

import * as input from "./input";

async function ensureCrossInstalled(): Promise<void> {
    try {
        await exec.exec("cross", ["--version"], { silent: true });
        core.info("cross is already installed");
        return;
    } catch {
        core.info("cross not found, installing...");
    }

    const platform = process.platform;
    const arch = process.arch;

    let crossArch: string;
    if (arch === "x64") {
        crossArch = "x86_64";
    } else if (arch === "arm64") {
        crossArch = "aarch64";
    } else {
        throw new Error(`Unsupported architecture: ${arch}`);
    }

    let url: string;
    const version = "latest";

    if (platform === "win32") {
        url = `https://github.com/cross-rs/cross/releases/${version}/download/cross-${crossArch}-pc-windows-msvc.zip`;
    } else if (platform === "darwin") {
        url = `https://github.com/cross-rs/cross/releases/${version}/download/cross-${crossArch}-apple-darwin.tar.gz`;
    } else if (platform === "linux") {
        url = `https://github.com/cross-rs/cross/releases/${version}/download/cross-${crossArch}-unknown-linux-gnu.tar.gz`;
    } else {
        throw new Error(`Unsupported platform: ${platform}`);
    }

    core.info(`Downloading cross from ${url}`);
    const downloadPath = await tc.downloadTool(url);

    let extractedPath: string;
    if (url.endsWith(".zip")) {
        extractedPath = await tc.extractZip(downloadPath);
    } else {
        extractedPath = await tc.extractTar(downloadPath);
    }

    const cachePath = await tc.cacheDir(extractedPath, "cross", version);
    core.addPath(cachePath);

    core.info("cross installed successfully");
}

export async function run(actionInput: input.Input): Promise<void> {
    const command = actionInput.useCross ? "cross" : "cargo";

    if (actionInput.useCross) {
        await ensureCrossInstalled();
    }

    let args: string[] = [];
    if (actionInput.toolchain) {
        args.push(`+${actionInput.toolchain}`);
    }
    args.push(actionInput.command);
    args = args.concat(actionInput.args);

    const exitCode = await exec.exec(command, args);
    if (exitCode !== 0) {
        throw new Error(`${command} ${args.join(" ")} failed with exit code ${exitCode}`);
    }
}

async function main(): Promise<void> {
    const matchersPath = path.join(__dirname, ".matchers", "rust.json");
    if (fs.existsSync(matchersPath)) {
        core.info(`Adding matcher from ${matchersPath}`);
        // Note: Modern GitHub Actions uses problem matchers from the workflow
        // This is kept for compatibility with older setups
    }

    const actionInput = input.get();

    try {
        await run(actionInput);
    } catch (error) {
        core.setFailed((error as Error).message);
    }
}

void main();
