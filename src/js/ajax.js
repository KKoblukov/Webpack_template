const xhr = new XMLHttpRequest();
xhr.open('GET', 'phones.json', true, 'login', 'pass');
xhr.send();
xhr.abort();
xhr.onreadystatechange = () => {
  if (xhr.readyState != 4) return;

  if (xhr.status != 200) alert(`${xhr.status} ${xhr.statusText}`);
  else alert(xhr.responseText);
};
xhr.timeout = 30000; // 30 сек
xhr.ontimeout = () => {
  alert('Timeout!!!');
};
xhr.setRequestHeader('name', 'value');

const ajax = 'Ajax';

export default ajax;
