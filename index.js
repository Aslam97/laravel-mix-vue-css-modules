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
            modules: true,
            sourceMap: false,
            importLoaders: 1, // laravel-mix default: 1
            esModule: true,
            localIdentName:
                options.cssLoaderOptions &&
                options.cssLoaderOptions.localIdentName
                    ? options.cssLoaderOptions.localIdentName
                    : this.defaultLocalIdentName(options.localIdentNameType)
        };

        const cssLoaderOptions = {
            ...config,
            ...options.cssLoaderOptions
        };

        const { cssLoaderOptions: deleted, ...newOptions } = options;

        this.options = Object.assign(
            {
                oneOf: false,
                preProcessor: {
                    scss: false,
                    less: false,
                    stylus: false
                },
                exclude: [],
                cssLoaderOptions: cssLoaderOptions
            },
            newOptions
        );
    }

    /**
     * Override the generated webpack configuration.
     *
     * @param {Object} config
     */
    webpackConfig(config) {
        const cssLoaders = config.module.rules.find(
            rule => rule.test.toString() === "/\\.css$/"
        );

        if (this.options.oneOf) this.handleOneOfCss(cssLoaders);
        else this.handleCss(cssLoaders);

        if (this.options.preProcessor.scss) {
            const scssLoaders = config.module.rules.find(
                rule => rule.test.toString() === "/\\.scss$/"
            );

            this.options.oneOf
                ? this.handleOneOfScss(scssLoaders)
                : this.handleScss(scssLoaders);
        }

        if (this.options.preProcessor.less) {
            const lessLoaders = config.module.rules.find(
                rule => rule.test.toString() === "/\\.less$/"
            );

            this.options.oneOf
                ? this.handleOneOfLess(lessLoaders)
                : this.handleLess(lessLoaders);
        }

        if (this.options.preProcessor.stylus) {
            const stylusLoaders = config.module.rules.find(
                rule => rule.test.toString() === "/\\.styl(us)?$/"
            );

            this.options.oneOf
                ? this.handleOneOfStylus(stylusLoaders)
                : this.handleStylus(stylusLoaders);
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

        cssLoaders.loaders.forEach(cssLoader => {
            if (cssLoader.loader === "css-loader") {
                Object.assign(cssLoader, {
                    options: this.options.cssLoaderOptions
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

        const postCssLoader = cssLoaders.loaders.find(
            cssLoader => cssLoader.loader === "postcss-loader"
        );

        delete cssLoaders.loaders;

        cssLoaders.oneOf = [
            {
                resourceQuery: /module/,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: this.options.cssLoaderOptions
                    }
                ]
            },
            {
                use: ["style-loader", "css-loader", postCssLoader]
            }
        ];

        return cssLoaders;
    }

    /**
     * handle normal css-module for pre-processcor
     *
     * @param {*} scssLoaders
     * @returns
     * @memberof VueCssModule
     */
    handleScss(scssLoaders) {
        this.handleExclude(scssLoaders);

        const [postCssLoader, sassLoader] = this.getDefaultScssConfig(
            scssLoaders
        );

        scssLoaders.loaders = [
            "style-loader",
            {
                loader: "css-loader",
                options: this.options.cssLoaderOptions
            },
            postCssLoader,
            sassLoader
        ];

        return scssLoaders;
    }

    /**
     * handle oneOf css-module for pre-processcor
     *
     * @param {*} sassLoaders
     * @returns
     * @memberof VueCssModule
     */
    handleOneOfScss(scssLoaders) {
        this.handleExclude(scssLoaders);

        const [postCssLoader, sassLoader] = this.getDefaultScssConfig(
            scssLoaders
        );

        delete scssLoaders.loaders;

        scssLoaders.oneOf = [
            {
                resourceQuery: /module/,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: this.options.cssLoaderOptions
                    },
                    postCssLoader,
                    sassLoader
                ]
            },
            {
                use: ["style-loader", "css-loader", postCssLoader, sassLoader]
            }
        ];

        return scssLoaders;
    }

    /**
     * handle normal css-module for pre-processcor
     *
     * @param {*} lessLoaders
     * @returns
     * @memberof VueCssModule
     */
    handleLess(lessLoaders) {
        this.handleExclude(lessLoaders);

        const postCssLoader = this.getDefaultLessAndStylusConfig(lessLoaders);

        lessLoaders.loaders = [
            "style-loader",
            {
                loader: "css-loader",
                options: this.options.cssLoaderOptions
            },
            postCssLoader,
            "less-loader"
        ];

        return lessLoaders;
    }

    /**
     *
     * @param {*} lessLoaders
     * @returns
     * @memberof VueCssModules
     */
    handleOneOfLess(lessLoaders) {
        this.handleExclude(lessLoaders);

        const postCssLoader = this.getDefaultLessAndStylusConfig(lessLoaders);

        delete lessLoaders.loaders;

        lessLoaders.oneOf = [
            // oneOf
            {
                resourceQuery: /module/,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: this.options.cssLoaderOptions
                    },
                    postCssLoader,
                    "less-loader"
                ]
            },
            // normal
            {
                use: [
                    "style-loader",
                    "css-loader",
                    postCssLoader,
                    "less-loader"
                ]
            }
        ];

        return lessLoaders;
    }
    /**
     *
     * @param {*} stylusLoaders
     * @returns
     * @memberof VueCssModules
     */
    handleStylus(stylusLoaders) {
        this.handleExclude(stylusLoaders);

        const postCssLoader = this.getDefaultLessAndStylusConfig(stylusLoaders);

        stylusLoaders.loaders = [
            "style-loader",
            {
                loader: "css-loader",
                options: this.options.cssLoaderOptions
            },
            postCssLoader,
            "stylus-loader"
        ];

        return stylusLoaders;
    }

    /**
     *
     * @param {*} stylusLoaders
     * @returns
     * @memberof VueCssModules
     */
    handleOneOfStylus(stylusLoaders) {
        this.handleExclude(stylusLoaders);

        const postCssLoader = this.getDefaultLessAndStylusConfig(stylusLoaders);

        delete stylusLoaders.loaders;

        stylusLoaders.oneOf = [
            // oneOf
            {
                resourceQuery: /module/,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: this.options.cssLoaderOptions
                    },
                    postCssLoader,
                    "stylus-loader"
                ]
            },
            // normal
            {
                use: [
                    "style-loader",
                    "css-loader",
                    postCssLoader,
                    "stylus-loader"
                ]
            }
        ];

        return stylusLoaders;
    }

    /**
     * get default config from laravel-mix
     *
     * @param {*} scssLoaders
     * @returns
     * @memberof VueCssModule
     */
    getDefaultScssConfig(scssLoaders) {
        const postCssLoader = scssLoaders.loaders.find(
            postCssLoader => postCssLoader.loader === "postcss-loader"
        );

        const sassLoader = scssLoaders.loaders.find(
            scssLoader => scssLoader.loader === "sass-loader"
        );

        return [postCssLoader, sassLoader];
    }

    /**
     *
     * @param {*} loaders
     * @returns
     * @memberof VueCssModules
     */
    getDefaultLessAndStylusConfig(loaders) {
        const postCssLoader = loaders.loaders.find(
            postCssLoader => postCssLoader.loader === "postcss-loader"
        );

        return postCssLoader;
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
                this.options.exclude.forEach(e => loaders.exclude.push(e));
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
