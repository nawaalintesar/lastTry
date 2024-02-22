// relationshipColors.js

const relationshipColors = {};

export const setRelationshipColors = (colors) => {
  Object.assign(relationshipColors, colors);
  console.log('Relationship Colors:', relationshipColors);
};

export const getRelationshipColor = (className) => {
  console.log('Relationship Colors in getter:', relationshipColors);
  return relationshipColors[className] || 'defaultColor';
};
