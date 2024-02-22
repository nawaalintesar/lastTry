// relationshipData.js
let inheritanceWithAbstract = [];

export const getInheritanceAbstractRelationships = () => inheritanceWithAbstract;

export const saveDataToRelationshipData = (data) => {
  console.log('Relationship Values:', inheritanceWithAbstract);
  if (data.inheritanceWithAbstract) {
    // Check if each item in data.inheritanceWithAbstract is already present in inheritanceWithAbstract
    data.inheritanceWithAbstract.forEach((item) => {
      const isAlreadyPresent = inheritanceWithAbstract.some(
        (existingItem) => existingItem.source === item.source
      );
      // If the item is not already present, add it to inheritanceWithAbstract
      if (!isAlreadyPresent) {
        inheritanceWithAbstract.push(item);
      }
    });
  }
};

