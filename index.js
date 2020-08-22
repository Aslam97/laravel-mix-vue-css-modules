const mix = require("laravel-mix");

class VueCssModule {
  /**
   * Register the component.
   *
   * When your component is called, all user parameters
   * will be passed to this method.
   *
   * Ex: register(src, output) {}
   * Ex: mix.yourPlugin('src/path', 'output/path');
   *
   * @param  {*} ...params
   * @return {void}
   *
   */
  register({
    localIdentName = "[local]_[hash:base64:8]",
    mode = "global",
    oneOf = false,
    sass = false,
  } = {}) {
    this.localIdentName = localIdentName;
    this.mode = mode;
    this.oneOf = oneOf;
    this.sass = sass;
  }

  /**
   * Override the generated webpack configuration.
   *
   * @param  {Object} webpackConfig
   * @return {void}
   */
  webpackConfig(webpackConfig) {
    webpackConfig.module.rules = webpackConfig.module.rules.map((rule) => {
      if (!rule.loaders) {
        return rule;
      }

      const sass = rule.loaders.find(
        (loader) => loader.loader === "sass-loader"
      );
      const css = rule.loaders.find((loader) => loader.loader === "css-loader");

      if (css != undefined) {
        if (this.oneOf) {
          const postCssConfig = rule.loaders.find(
            (loader) => loader.loader === "postcss-loader"
          );

          delete rule.loaders;
          Object.assign(rule, {
            test: /\.css$/,
            oneOf: [
              {
                resourceQuery: /module/,
                use: [
                  "style-loader",
                  {
                    loader: "css-loader",
                    options: this[this.mode](),
                  },
                ],
              },
              {
                use: ["style-loader", postCssConfig],
              },
            ],
          });
        } else {
          Object.assign(css.options, this[this.mode]());
        }
      }

      if (
        this.sass &&
        sass != undefined &&
        rule.test.toString() === /\.scss$/.toString()
      ) {
        const postCssLoader = rule.loaders.find(
          (l) => l.loader === "postcss-loader"
        );
        const sassLoader = rule.loaders.find((l) => l.loader === "sass-loader");
        delete rule.loaders;

        Object.assign(rule, {
          test: /\.scss$/,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: this[this.mode](),
            },
            postCssLoader,
            sassLoader,
          ],
        });
      }

      return rule;
    });

    return webpackConfig;
  }

  /**
   * Return default mode
   *
   * @return {object}
   */
  global() {
    return {
      modules: true,
      localIdentName: this.localIdentName,
    };
  }

  /**
   * Return local mode
   *
   * @return {object}
   */
  local() {
    return {
      modules: {
        mode: this.mode,
        localIdentName: this.localIdentName,
      },
    };
  }
}

mix.extend("vueCssModules", new VueCssModule());
