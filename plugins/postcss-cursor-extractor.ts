import { Plugin, PluginCreator } from "postcss";

interface CursorRule {
  selector: string;
  cursor: string;
  file?: string;
}

interface PluginOptions {
  store: CursorRule[];
}

const plugin: PluginCreator<PluginOptions> = (opts?: PluginOptions) => {
  if (!opts?.store) {
    throw new Error("Cursor extractor plugin requires a store option");
  }

  const store = opts.store;

  return {
    postcssPlugin: "postcss-cursor-extractor",
    prepare() {
      return {
        Rule(rule) {
          rule.walkDecls("cursor", (decl) => {
            store.push({
              selector: rule.selector,
              cursor: decl.value,
              file: decl.source?.input.file,
            });
          });
        },
      };
    },
  } as Plugin;
};

plugin.postcss = true;

export default plugin;
