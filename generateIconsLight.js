const fs = require("fs");
const path = require("path");

// Path to the Font Awesome Pro Light index file
const faIndexPath = path.resolve(
  __dirname,
  "node_modules/@fortawesome/pro-light-svg-icons/index.mjs"
);

try {
  // Read the content of index.mjs
  const content = fs.readFileSync(faIndexPath, "utf8");

  // Regular expression to find icon definitions and extract the iconName
  // It looks for patterns like: const faIconName = { ... prefix: 'fal', iconName: 'icon-name', ... }
  const iconRegex =
    /const\s+fa[A-Za-z0-9]+\s*=\s*{\s*prefix:\s*'(fal)',\s*iconName:\s*'([^']+)'/g;

  const icons = [];
  let match;

  // Extract all matches
  while ((match = iconRegex.exec(content)) !== null) {
    const prefix = match[1]; // Should always be 'fal' based on the regex
    const name = match[2]; // The captured icon name
    icons.push({ prefix, name });
  }

  // Check if icons were found
  if (icons.length === 0) {
    console.error(
      "Could not find any icons matching the pattern in:",
      faIndexPath
    );
    console.error(
      "Please ensure the file exists and the regex pattern is correct for the installed version."
    );
    process.exit(1);
  }

  // Sort icons alphabetically by name for consistency
  icons.sort((a, b) => a.name.localeCompare(b.name));

  // Generate the output string
  let output = "export const iconsLight = [\n";
  output += icons
    .map((icon) => `  { prefix: "${icon.prefix}", name: "${icon.name}" }`)
    .join(",\n");
  output += "\n];\n";

  // Print the result to the console
  console.log(output);
  console.error(`\nSuccessfully generated ${icons.length} icons.`);
  console.error(`You can redirect this output to src/icons/iconsLight.js:`);
  console.error(`node generateIconsLight.js > src/icons/iconsLight.js`);
} catch (error) {
  console.error("Error processing Font Awesome icons:", error);
  if (error.code === "ENOENT") {
    console.error(`\nError: Could not find the file at ${faIndexPath}`);
    console.error(
      "Please ensure '@fortawesome/pro-light-svg-icons' is installed correctly in your node_modules directory."
    );
  }
  process.exit(1);
}
