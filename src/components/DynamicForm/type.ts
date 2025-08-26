export type TagType<T> = {
  [K in keyof T]: {
    type: "input" | "color" | "textarea" | "icon-select";
    label: string;
    required?: boolean;
    placeholder?: string;
  };
};

// 定义字段配置的类型
export interface FieldConfig {
  type: string;
  label: string;
  required?: boolean;
  placeholder?: string;
}
