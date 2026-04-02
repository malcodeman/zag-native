module.exports = {
    plugins: [
        require('react-strict-dom/postcss-plugin')({
            include: [
                // Include source files to watch for style changes
                // Be specific and avoid a non-specific glob like "**/*.{js,jsx}" which could cause major performance issues during build
                'src/**/*.{js,jsx,mjs,ts,tsx}',
                // List any installed node_modules that include UI built with React Strict DOM
                'node_modules/<package-name>/*.js'
            ]
        }),
        require('autoprefixer')
    ]
};