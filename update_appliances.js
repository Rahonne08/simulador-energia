const fs = require('fs');

const appliancesText = fs.readFileSync('/appliances.txt', 'utf8');
const lines = appliancesText.split('\n').filter(line => line.trim() !== '');

const newAppliances = [];

for (const line of lines) {
  const match = line.match(/^(.*?)\s+(\d+)$/);
  if (match) {
    let rawName = match[1].trim();
    const power = parseInt(match[2], 10);
    
    // Title case the name
    let name = rawName.split(' ').map(word => {
      if (word.length === 0) return '';
      if (['DE', 'DO', 'DA', 'EM', 'OU', 'E', 'A', 'O', 'P/', 'C/'].includes(word)) {
        return word.toLowerCase();
      }
      if (word.match(/^[0-9]+$/) || word.match(/^[0-9]+W$/) || word.match(/^[0-9]+V$/) || word.match(/^[0-9]+L$/) || word.match(/^[0-9]+CV$/) || word.match(/^[0-9]+HP$/) || word.match(/^[0-9]+MA$/) || word.match(/^[0-9]+KVA$/) || word.match(/^[0-9]+TR$/) || word.match(/^[0-9]+BTU'S$/) || word.match(/^[0-9]+LTS$/) || word.match(/^[0-9]+KG$/)) {
        return word; // Keep numbers and units as is
      }
      if (word === 'TV' || word === 'DVD' || word === 'LED' || word === 'LCD' || word === 'USB' || word === 'PC' || word === 'HP' || word === 'CV' || word === 'W' || word === 'V' || word === 'L' || word === 'MA' || word === 'KVA' || word === 'TR' || word === 'BTU\'S' || word === 'LTS' || word === 'KG') {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');

    newAppliances.push({ name, power });
  }
}

const constantsPath = '/src/constants.ts';
let constantsContent = fs.readFileSync(constantsPath, 'utf8');

// Extract existing appliances
const existingMatch = constantsContent.match(/export const COMMON_APPLIANCES = \[([\s\S]*?)\];/);
if (!existingMatch) {
  console.error("Could not find COMMON_APPLIANCES");
  process.exit(1);
}

const existingStr = existingMatch[1];
const existingLines = existingStr.split('\n').filter(line => line.trim() !== '');

const existingAppliances = [];
for (const line of existingLines) {
  const match = line.match(/{ name: '(.*?)', quantity: (\d+), power: (\d+), hoursPerDay: ([\d.]+), daysPerMonth: (\d+) }/);
  if (match) {
    existingAppliances.push({
      name: match[1],
      quantity: parseInt(match[2], 10),
      power: parseInt(match[3], 10),
      hoursPerDay: parseFloat(match[4]),
      daysPerMonth: parseInt(match[5], 10)
    });
  }
}

// Merge
const finalAppliances = [...existingAppliances];

for (const newApp of newAppliances) {
  // Try to find an exact match case insensitive
  let matched = false;
  for (const existing of finalAppliances) {
    if (existing.name.toLowerCase() === newApp.name.toLowerCase()) {
      existing.power = newApp.power;
      matched = true;
      break;
    }
  }
  
  if (!matched) {
    // Add new
    finalAppliances.push({
      name: newApp.name,
      quantity: 1,
      power: newApp.power,
      hoursPerDay: 1, // Default to 1 hour
      daysPerMonth: 30 // Default to 30 days
    });
  }
}

// Sort alphabetically
finalAppliances.sort((a, b) => a.name.localeCompare(b.name));

// Generate new string
let newArrayStr = 'export const COMMON_APPLIANCES = [\n';
for (const app of finalAppliances) {
  newArrayStr += `  { name: '${app.name.replace(/'/g, "\\'")}', quantity: ${app.quantity}, power: ${app.power}, hoursPerDay: ${app.hoursPerDay}, daysPerMonth: ${app.daysPerMonth} },\n`;
}

constantsContent = constantsContent.replace(/export const COMMON_APPLIANCES = \[([\s\S]*?)\];/, newArrayStr);

fs.writeFileSync(constantsPath, constantsContent);
console.log("Updated constants.ts");
