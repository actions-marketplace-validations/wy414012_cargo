import path from "path";
import * as fs from "fs";

import * as core from "@actions/core";
import * as exec from "@actions/exec";

import * as input from "./input";

export async function run(actionInput: input.Input): Promise<void> {
    const command = actionInput.useCross ? "cross" : "cargo";

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
