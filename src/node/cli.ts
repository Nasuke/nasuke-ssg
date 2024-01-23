import { cac } from 'cac'

// 版本号 
const version = require("../../package.json").version

const cli = cac("nasuke").version(version).help()

cli
  .command("[root]", "start dev server")
  .alias("dev")
  .action(async (root: string) => {
    console.log("dev", root);
  });

cli
  .command("build [root]", "build for production")
  .action(async (root: string) => {
    console.log("build", root);
  });

cli.parse();


