import keyBy from 'lodash/keyBy.js';
import isEmpty from 'lodash/isEmpty.js';
import * as yup from 'yup';
import onChange from 'on-change';
import axios from 'axios';

const routes = {
  usersPath: () => '/users',
};

const schema = yup.object().shape({
  name: yup.string().trim().required(),
  email: yup.string().required('email must be a valid email').email(),
  password: yup.string().required().min(6),
  passwordConfirmation: yup.string()
    .required('password confirmation is a required field')
    .oneOf(
      [yup.ref('password'), null],
      'password confirmation does not match to password',
    ),
});

// Этот объект можно использовать для того, чтобы обрабатывать ошибки сети.
// Это необязательное задание, но крайне рекомендуем попрактиковаться.
const errorMessages = {
  network: {
    error: 'Network Problems. Try again.',
  },
};

// Используйте эту функцию для выполнения валидации.
// Выведите в консоль её результат, чтобы увидеть, как получить сообщения об ошибках.
const validate = (fields) => {
  try {
    schema.validateSync(fields, { abortEarly: false });
    return {};
  } catch (e) {
    return keyBy(e.inner, 'path');
  }
};

// BEGIN
export default () => {
  const container = document.querySelector('[data-container="sign-up"]');
  const form = container.querySelector('form');

  const state = {
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    isSubmitting: false,
  };

  const touched = {
    name: false,
    email: false,
    password: false,
    passwordConfirmation: false,
  };

  const renderField = (name, input, errors) => {
    const error = errors[name];
    let feedback = input.nextElementSibling;

    if (error) {
      input.classList.add('is-invalid');
      if (!feedback || !feedback.classList.contains('invalid-feedback')) {
        feedback = document.createElement('div');
        feedback.classList.add('invalid-feedback');
        input.after(feedback);
      }
      feedback.textContent = error.message;
    } else {
      input.classList.remove('is-invalid');
      if (feedback && feedback.classList.contains('invalid-feedback')) {
        feedback.remove();
      }
    }
  };

  const render = () => {
    const submitBtn = form.querySelector('[type="submit"]');
    const fields = {
      name: state.name,
      email: state.email,
      password: state.password,
      passwordConfirmation: state.passwordConfirmation,
    };
    const errors = validate(fields);
    const visibleErrors = Object.fromEntries(
      Object.entries(errors).filter(([key]) => touched[key]),
    );
    submitBtn.disabled = state.isSubmitting || !isEmpty(errors);

    ['name', 'email', 'password', 'passwordConfirmation'].forEach((name) => {
      const input = form.querySelector(`[name="${name}"]`);
      input.value = state[name];
      renderField(name, input, visibleErrors);
    });
  };

  const proxy = onChange(state, () => {
    render();
  });

  form.addEventListener('input', (e) => {
    const { name, value } = e.target;
    touched[name] = true;
    proxy[name] = value;
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    proxy.isSubmitting = true;
    await axios.post(routes.usersPath(), {
      name: state.name,
      email: state.email,
      password: state.password,
    });
    container.textContent = 'User Created!';
  });

  render();
};
// END
