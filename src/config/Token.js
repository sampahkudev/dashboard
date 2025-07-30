const token =localStorage.getItem("iss_token")

if (!token) {
    window.location.href = 'https://sampahkudev.github.io/landing-page/login.html';
}

const getToken = () => {
  return token;
};

export default getToken;
