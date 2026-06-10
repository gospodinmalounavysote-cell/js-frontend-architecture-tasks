// BEGIN
export default (companies) => {
  const container = document.querySelector('.container');
  let openId = null;
  let descriptionEl = null;

  companies.forEach((company) => {
    const button = document.createElement('button');
    button.classList.add('btn', 'btn-primary');
    button.textContent = company.name;
    button.addEventListener('click', () => {
      if (openId === company.id) {
        descriptionEl.remove();
        descriptionEl = null;
        openId = null;
        return;
      }
      if (descriptionEl) {
        descriptionEl.remove();
      }
      descriptionEl = document.createElement('div');
      descriptionEl.textContent = company.description;
      container.appendChild(descriptionEl);
      openId = company.id;
    });
    container.appendChild(button);
  });
};
// END
