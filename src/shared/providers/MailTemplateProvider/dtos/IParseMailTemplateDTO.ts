interface ITemplateVariables {
    [key: string]: string | number | Object | Array<Object>;
}

export interface IParseMailTemplateDTO {
    file: string;
    variables?: ITemplateVariables;
}