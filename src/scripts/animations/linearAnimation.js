const last = Date.now();

function linearAnimation(data, duration) {
  const now = Date.now();
  const elapsed = (now - last) / 1000.0;

  return data.map((y) => {
    const newY = (y * elapsed) / duration;
    return newY > y ? y : newY;
  });
}

export default linearAnimation;
