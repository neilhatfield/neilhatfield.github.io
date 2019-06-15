function factorial(n) {
  if (n == 0 || n == 1)
    return 1;
  if (factorial.vals[n] > 0)
    return factorial.vals[n];
  return factorial.vals[n] = factorial(n-1) * n;
}
factorial.vals = [];

function binomial(n, k) {
     if ((typeof n !== 'number') || (typeof k !== 'number')) 
  return false; 
    var coeff = 1;
    for (var x = n-k+1; x <= n; x++) coeff *= x;
    for (x = 1; x <= k; x++) coeff /= x;
    return coeff;
}