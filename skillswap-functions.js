function filterSkillsByCategory(skills, category) {
  if (category === 'All') {
    return skills;
  }
  return skills.filter((skill) => skill.category === category);
}

function calculateTotalCost(hourlyRate, hours) {
  return hourlyRate * hours;
}

function matchSkillsToUser(userNeeds, skills) {
  return skills.filter(
    (skill) =>
      skill.category === userNeeds.category && skill.price <= userNeeds.maxPrice
  );
}

// Export for Jest (Node) only; the browser has no `module`
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    filterSkillsByCategory,
    calculateTotalCost,
    calculateTotalCosts: calculateTotalCost, // alias matching the assignment text
    matchSkillsToUser
  };
}