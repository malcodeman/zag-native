module.exports = {
    plugins: [
        require('react-strict-dom/postcss-plugin')({
            include: [
                // Include source files to watch for style changes
                'app/**/*.{js,jsx,mjs,ts,tsx}',
                'components/**/*.{js,jsx,mjs,ts,tsx}',
            ]
        }),
        require('autoprefixer')
    ]
};