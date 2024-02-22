// parentClassData.js

let parentClassMethods = [];

export const getParentClassMethods = () => parentClassMethods;

export const saveParentClassMethods = (methods) => {
  parentClassMethods = methods;
};

