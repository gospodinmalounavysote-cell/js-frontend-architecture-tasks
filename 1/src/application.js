// BEGIN
export default () => {
  const form = document.querySelector('form[name="calculator"]');
  const resetBtn = form.querySelector('button[type="button"]');
  let sum = 0;

  const render = () => {
    document.getElementById('result').textContent = sum;
    form.querySelector('input[name="number"]').focus();
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    sum += parseInt(formData.get('number'), 10);
    form.reset();
    render();
  });

  resetBtn.addEventListener('click', () => {
    sum = 0;
    form.reset();
    render();
  });

  render();
};
// END
