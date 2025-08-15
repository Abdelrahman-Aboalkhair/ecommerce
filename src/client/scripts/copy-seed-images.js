const fs = require("fs");
const path = require("path");

// Source and destination paths
const sourcePath = path.join(__dirname, "../../../assets/seed-images");
const destPath = path.join(__dirname, "../public/assets/seed-images");

// Create destination directory if it doesn't exist
if (!fs.existsSync(destPath)) {
  fs.mkdirSync(destPath, { recursive: true });
}

// Copy directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied: ${entry.name}`);
    }
  }
}

// Copy seed images if source exists
if (fs.existsSync(sourcePath)) {
  console.log("Copying seed images to public directory...");
  copyDir(sourcePath, destPath);
  console.log("✅ Seed images copied successfully!");
} else {
  console.log("⚠️  No seed images found. Using fallback images.");
}
