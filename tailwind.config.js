module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mjs}', // .mjsを含める
    './src/components/**/*.{js,ts,jsx,tsx,mjs}',
    './src/app/**/*.{js,ts,jsx,tsx,mjs}', // 必要であれば
    './src/lib/**/*.{js,ts,jsx,tsx,mjs}', // libディレクトリを追加
    './src/scripts/**/*.{js,ts,jsx,tsx,mjs}', // scriptsディレクトリを追加
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};


