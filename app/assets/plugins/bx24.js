// export default defineNuxtPlugin(async (nuxtApp) => {
//   return new Promise((resolve) => {
//     const script = document.createElement('script');
//     script.src = 'https://api.bitrix24.com/api/v1/';
//     script.onload = () => {
//       resolve({
//         provide: {
//           bx24: window.BX24
//         }
//       });
//     };
//     document.head.appendChild(script);
//   });
// });