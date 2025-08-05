export const parseDynamicURL = (urlTemplate, rowData) => {
    // Assuming dynamic variables are enclosed in curly braces {}
    const pattern = /\$([a-zA-Z_$][a-zA-Z0-9_$]*)/g;

    const dynamicVars = urlTemplate.match(pattern);

    if (!dynamicVars) {
      return urlTemplate;
    }

    let parsedURL = urlTemplate;
    dynamicVars.forEach((dynamicVar) => {
      const fieldName = dynamicVar.slice(1);
      parsedURL = parsedURL.replace(dynamicVar, rowData[fieldName]);
    });

    return parsedURL;
  };
