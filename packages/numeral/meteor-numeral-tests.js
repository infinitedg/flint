
Tinytest.add('Numeral - Comma test', function (test) {
  var s = numeral(1000).format('0,0');
  test.equal(s, '1,000', 'Numeral failed comma test');
});

Tinytest.add('Numeral - Currency test', function (test) {
  var s = numeral(1000.234).format('$0,0.00');
  test.equal(s, '$1,000.23', 'Numeral failed currency test');
});

Tinytest.add('Numeral - Bytes test', function (test) {
  var s = numeral(3467479682787).format('0.000 b');
  test.equal(s, '3.154 TB', 'Numeral failed bytes test');
});

Tinytest.add('Numeral - Unformat test', function (test) {
  var n = numeral().unformat('$10,000.00');
  test.equal(n, 10000, 'Numeral failed unformat test');
});

Tinytest.add('Numeral - Manipulate test', function (test) {
  var n = numeral(1000);
  test.equal(n.add(10).value(), 1010, 'Numeral failed manipulate test');
});
