import { CCActionConfig } from '../editorTypes';

export interface EditorTarget extends EventTarget {
  value?: string;
  index?: number;
  checked?: boolean;
  configValue?: string;
  type?: HTMLInputElement['type'];
  config: CCActionConfig;
}
