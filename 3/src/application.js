// BEGIN
export default (laptops) => {
  const form = document.querySelector('form');
  const result = document.querySelector('.result');

  const filterLaptops = () => {
    const formData = new FormData(form);
    const filters = {
      processor_eq: formData.get('processor_eq'),
      memory_eq: formData.get('memory_eq'),
      frequency_gte: formData.get('frequency_gte'),
      frequency_lte: formData.get('frequency_lte'),
    };

    return laptops.filter((laptop) => Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      if (key.endsWith('_eq')) {
        const field = key.replace('_eq', '');
        return String(laptop[field]) === value;
      }
      if (key.endsWith('_gte')) {
        const field = key.replace('_gte', '');
        return laptop[field] >= parseFloat(value);
      }
      if (key.endsWith('_lte')) {
        const field = key.replace('_lte', '');
        return laptop[field] <= parseFloat(value);
      }
      return true;
    }));
  };

  const render = () => {
    const filtered = filterLaptops();
    result.innerHTML = '';
    if (filtered.length === 0) return;
    const ul = document.createElement('ul');
    filtered.forEach((laptop) => {
      const li = document.createElement('li');
      li.textContent = laptop.model;
      ul.appendChild(li);
    });
    result.appendChild(ul);
  };

  form.addEventListener('input', render);
  form.addEventListener('change', render);
  render();
};
// END
