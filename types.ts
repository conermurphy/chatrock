export type PromptFormInputs = {
  prompt: string;
};

export enum IPromptStatus {
  ACTIVE = 'ACTIVE',
  DEPRECATED = 'DEPRECATED',
}

export type PromptQueryParams = {
  params: {
    uuid: string;
  };
};
