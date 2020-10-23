const mix = require("laravel-mix");

class VueCssModules {
  /**
   * Register the component.
   *
   * @param {Object} options
   * @param {Boolean} [options.oneOf]
   * @param {Boolean} [options.preProcessor]
   * @param {String} [options.localIdentNameType]
   * @param {Object} [options.cssLoaderOptions]
   */
  register(options = {}) {
    const config = {
      modules: true, // {Boolean\|String\|Object}
      sourceMap: false, // {Boolean}
      importLoaders: 1, // {Number} // webpackDefault: 0 // laravel-mix default: 1
      esModule: true, // {Boolean},
      localIdentName:
        options.cssLoaderOptions && options.cssLoaderOptions.localIdentName
          ? options.cssLoaderOptions.localIdentName
          : this.defaultLocalIdentName(options.localIdentNameType), // {String}
    };

    const cssLoaderOptions = {
      ...config,
      ...options.cssLoaderOptions,
    };

    delete options.cssLoaderOptions;

    this.options = Object.assign(
      {
        oneOf: false,
        preProcessor: true,
        exclude: [],
        cssLoaderOptions: cssLoaderOptions,
      },
      options
    );
  }

  /**
   * Override the generated webpack configuration.
   *
   * @param {Object} config
   */
  webpackConfig(config) {
    // for css-loader
    const cssLoaders = config.module.rules.find(
      (rule) => rule.test.toString() === "/\\.css$/"
    );

    if (this.options.oneOf) this.handleOneOfCss(cssLoaders);
    else this.handleCss(cssLoaders);

    // only if pre-processor activated || default is active
    if (this.options.preProcessor) {
      // for sass-loader
      const sassLoaders = config.module.rules.find(
        (rule) => rule.test.toString() === "/\\.scss$/"
      );

      if (this.options.oneOf) this.handleOneOfPreProcessor(sassLoaders);
      else this.handlePreProcessor(sassLoaders);
    }
  }

  /**
   * handle normal css-module
   *
   * @param {*} cssLoaders
   * @returns
   * @memberof VueCssModule
   *
   */
  handleCss(cssLoaders) {
    this.handleExclude(cssLoaders);

    cssLoaders.loaders.forEach((cssLoader) => {
      if (cssLoader.loader === "css-loader") {
        Object.assign(cssLoader, {
          options: this.options.cssLoaderOptions,
        });
      }
    });

    return cssLoaders;
  }

  /**
   * handle oneOf css-module
   *
   * @param {*} cssLoaders
   * @returns
   * @memberof VueCssModule
   */
  handleOneOfCss(cssLoaders) {
    this.handleExclude(cssLoaders);

    // keep default config for postcss-loader
    const postCssLoader = cssLoaders.loaders.find(
      (cssLoader) => cssLoader.loader === "postcss-loader"
    );

    // reset loaders change with use
    delete cssLoaders.loaders;

    cssLoaders.oneOf = [
      {
        resourceQuery: /module/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: this.options.cssLoaderOptions,
          },
        ],
      },
      {
        use: ["style-loader", postCssLoader],
      },
    ];

    return cssLoaders;
  }

  /**
   * handle normal css-module for pre-processcor
   *
   * @param {*} sassLoaders
   * @returns
   * @memberof VueCssModule
   */
  handlePreProcessor(sassLoaders) {
    this.handleExclude(sassLoaders);

    const [postCssLoader, sassLoader] = this.getDefaultPreProcessorConfig(
      sassLoaders
    );

    // re-create config & add custom css-loader for .scss
    sassLoaders.loaders = [
      "style-loader",
      {
        loader: "css-loader",
        options: this.options.cssLoaderOptions,
      },
      postCssLoader,
      sassLoader,
    ];

    return sassLoaders;
  }

  /**
   * handle oneOf css-module for pre-processcor
   *
   * @param {*} sassLoaders
   * @returns
   * @memberof VueCssModule
   */
  handleOneOfPreProcessor(sassLoaders) {
    this.handleExclude(sassLoaders);

    const [postCssLoader, sassLoader] = this.getDefaultPreProcessorConfig(
      sassLoaders
    );

    delete sassLoaders.loaders;

    sassLoaders.oneOf = [
      {
        resourceQuery: /module/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: this.options.cssLoaderOptions,
          },
          postCssLoader,
          sassLoader,
        ],
      },
      {
        use: ["style-loader", "css-loader", postCssLoader, sassLoader],
      },
    ];

    return sassLoaders;
  }

  /**
   * get default config from laravel-mix
   *
   * @param {*} sassLoaders
   * @returns
   * @memberof VueCssModule
   */
  getDefaultPreProcessorConfig(sassLoaders) {
    // keep default config for postcss-loader
    const postCssLoader = sassLoaders.loaders.find(
      (sassLoader) => sassLoader.loader === "postcss-loader"
    );

    // keep default config for sass-loader
    const sassLoader = sassLoaders.loaders.find(
      (sassLoader) => sassLoader.loader === "sass-loader"
    );

    return [postCssLoader, sassLoader];
  }

  /**
   * handle exclude
   *
   * @param {*} loaders
   * @returns
   * @memberof VueCssModule
   */
  handleExclude(loaders) {
    if (this.options.exclude.length > 0) {
      if (loaders.exclude === undefined) {
        loaders.exclude = this.options.exclude;
      } else {
        this.options.exclude.forEach((e) => loaders.exclude.push(e));
      }
    }

    return loaders;
  }

  /**
   * get default type for localIdentName
   *
   * @returns
   * @memberof VueCssModule
   */
  defaultLocalIdentName(type) {
    if (type === "react") {
      return this.reactLocalIdentName();
    }

    if (type === "discord") {
      return this.discordLocalIdentName();
    }

    return Mix.inProduction() ? "[hash:base64]" : "[path][name]__[local]";
  }

  /**
   * Example localIdentName like react
   */
  reactLocalIdentName() {
    return "[name]___[local]___[hash:base64:5]";
  }

  /**
   * Example localIdentName like discord
   */
  discordLocalIdentName() {
    return "[local]-[hash:base64:5]";
  }
}

mix.extend("vueCssModules", new VueCssModules());
