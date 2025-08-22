import fs from "fs";
import path from "path";

const folders = ["blog", "portfolio", "resume", "career", "meta"];

const files: Record<string, string> = {
  "meta/tags.yml": "# tags: []\n",
  "meta/categories.yml": "# categories: []\n",
  "meta/config.yml": "title: GeekLog Blog\nbaseUrl: http://localhost:3000\n",
};

export function initProject() {
  console.log("🚀 Initializing GeekLog project...");

  folders.forEach((folder) => {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
      console.log(`📂 Created folder: ${folder}`);
    }
  });

  Object.entries(files).forEach(([file, content]) => {
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, content, "utf8");
      console.log(`📝 Created file: ${file}`);
    }
  });

  console.log("✅ GeekLog project initialized!");
}
