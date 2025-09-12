export const validateFields = (body: any, requiredFields: string[]): string[] => {
  let missingFieldsMessages: string[] = [];
  for (const field of requiredFields) {
    if (!body[field]) {
      missingFieldsMessages.push(
        `The "${field}" field is required but is missing in the request body.`,
      );
    }
  }
  return missingFieldsMessages;
};
