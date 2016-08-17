var fs = require("fs");

SupCore.system.registerPlugin("typescriptAPI", "fLang", {
  code: fs.readFileSync(__dirname + "/fLang.ts", { encoding: "utf8" }),
  defs: fs.readFileSync(__dirname + "/fLang.d.ts", { encoding: "utf8" })
});
