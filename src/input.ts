/**
 * Parse action input into a some proper thing.
 */

import * as core from "@actions/core";

import stringArgv from "string-argv";

// Parsed action input
export interface Input {
    command: string;
    toolchain?: string;
    args: string[];
    useCross: boolean;
}

export function get(): Input {
    const command = core.getInput("command", { required: true });
    const args = stringArgv(core.getInput("args"));
    let toolchain = core.getInput("toolchain");
    if (toolchain.startsWith("+")) {
        toolchain = toolchain.slice(1);
    }
    const useCross = core.getInput("use-cross") === "true";

    return {
        command: command,
        args: args,
        useCross: useCross,
        toolchain: toolchain || undefined,
    };
}
