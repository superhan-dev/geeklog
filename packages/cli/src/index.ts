#!/usr/bin/env node
import { Command } from "commander";
import { initProject } from "./init.js";

const program = new Command();

program
  .name("geeklog")
  .description("GeekLog CLI - Markdown 기반 블로그/포트폴리오 관리 도구")
  .version("0.1.0");

program
  .command("init")
  .description("Initialize GeekLog folder structure")
  .action(() => {
    initProject();
  });

program.parse(process.argv);
