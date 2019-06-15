/* Refer to http://jstat.github.io/distributions.html for reference on jStat functions */

/*Determine how many significant digits one wants. */
var decimals = 8;
/* This note will be displayed when there is calculator drool */
var calcDroolMessage = "Warning - Calculator drool!!!";

/* High-level object, distributions, holds all the distribution objects */
var distributions = {
    /*Start with binomial distribution. Give it a displayname, and then start listing properties */
    binomial: {
        displayName: 'Binomial',
        description: 'A binomial situation is any situation that involves a binomial stochastic process.  Specifically, the stochastic process must relate to sequence of Bernoulli trials and the stochastic variable of interest is the count of "successes" in a fixed (and known) number of trials (represented by <i>X</i>). <br/><br/> The cumulative probability function (CPF, a.k.a. CDF) for a binomial situation is \\[ C_B\\left(x|n,p\\right)=\\sum_{i=0}^x\\left(\\frac{n!}{i!(n-i)!}p^j(1-p)^{(n-i)}\\times\\Delta i\\right)\\] where the parameter <i>n</i> is the total number of Bernoulli trials, the parameter <i>p</i> is the probability of "success", and the input <i>x</i> is the maximum number of successes we want to observe in the <i>n</i> trials. Since <i>X</i> is a discrete stochastic variable, $\\Delta i$ always equals one. The Rate of Change function (probability mass function) is defined as \\[ B\\left(x|n,p\\right)=\\frac{n!}{x!(n-x)!}p^{x}(1-p)^{(n-p)}.\\] When a stochastic variable follows a binomial distribution, we will write $X\\sim\\mathcal{Bin}(n,p)$.',
        params: {
            param1: {
                paramId: 'numTrials',
                paramName: 'Number of Trials (<i>n</i>)',
                paramValue: 8
            },
            param2: {
                paramId: 'probSuccess',
                paramName: 'Probability of "Success" (<i>p</i>)',
                paramValue: 0.6
            },
            param3: {
                paramId: 'lowerLimit',
                paramName: 'Lower Limit (value excluded when non-zero)',
                paramValue: 0
            },
            param4: {
                paramId: 'upperLimit',
                paramName: 'Upper Limit (Max Num. of Successes)',
                paramValue: 5
            }
        },
        outputLabel: 'The Cumulative Probability of [Upper Limit] or fewer Successes',
        computeProbability: function () {
            /* First try to get input */
            try {
                var n = this.params.param1.paramValue;
                n = Parser.eval(n);
            	var p = this.params.param2.paramValue;
                p = Parser.eval(p);
                var a = this.params.param3.paramValue;
                a = Parser.eval(a);
                var b = this.params.param4.paramValue;
                b = Parser.eval(b);                
            } catch (err) {
                return 'Your input is invalid';
            }

            /*Check for non-numerics, and add restrictions */
            if (parseInt(a) != a || a < 0 || parseInt(b) != b || b < 0 || b < a || parseFloat(p) != p || parseInt(n) != n) {
                return 'Your input is invalid.';
            } else {
                a = parseInt(a);
                b = parseInt(b);
                p = parseFloat(p);
                n = parseInt(n);
            }
            if (a == 0) {
            var cdf_a = jStat.binomial.cdf((a - 1), n, p);
            var cdf_b = jStat.binomial.cdf(b, n, p);
            if ((cdf_a == 0 || cdf_a) && (cdf_b == 0 || cdf_b)) {
                var HTMLout = '\\[ \\sum_{i=' + chopDecimals(a, 3) + '}^{' + chopDecimals(b, 3) + '}';
                HTMLout += ' \\frac{' + n + '!}{i!\\left('+ n +'-i\\right)!}' + chopDecimals(p, 3) + '^i (' + chopDecimals((1 - p), 3) + ')^{' + chopDecimals(n, 3) + '-i} = ';
                HTMLout += (cdf_b - cdf_a).toFixed(decimals) + '\\]';
                /* Generate Plot */
                ggbApplet.reset();
                document.getElementById('plot_wrapper').style.display = 'block';
                this.plot(n, p, a, b);
                return HTMLout;
            } else {
                return 'Your input is invalid.';
            }
            }
            else {
            var cdf_a = jStat.binomial.cdf(a, n, p);
            var cdf_b = jStat.binomial.cdf(b, n, p);
            if ((cdf_a == 0 || cdf_a) && (cdf_b == 0 || cdf_b)) {
                var HTMLout = '\\[ \\sum_{i=' + (chopDecimals(a, 3) + 1) + '}^{' + chopDecimals(b, 3) + '}';
                HTMLout += ' \\frac{' + n + '!}{i!\\left('+ n +'-i\\right)!}' + chopDecimals(p, 3) + '^i (' + chopDecimals((1 - p), 3) + ')^{' + chopDecimals(n, 3) + '-i} = ';
                HTMLout += (cdf_b - cdf_a).toFixed(decimals) + '\\]';
                /* Generate Plot */
                ggbApplet.reset();
                document.getElementById('plot_wrapper').style.display = 'block';
                this.plot(n, p, a, b);
                return HTMLout;
            } else {
                return 'Your input is invalid.';
            }
            }
        },
        /*This property is an object that holds properties about the*/
        plot: function (n, p, a, b) {
            try {
                /* 
                 *First we are going to find the max of the distribution 
                 *The binomial distribution first increases, then decreases. Use Calculus thinking.
                 */
                /*Set Coord system to fit distribution */
                ggbApplet.setCoordSystem(-n / 5, n + 2, -0.1, 1.2);
                /* Plot the binomial distribution */
                ggbApplet.evalCommand('Binom = BinomialDist[' + n + ',' + p + ', true]');
                ggbApplet.setLabelVisible('Binom', false);
                ggbApplet.setColor('Binom', 0, 0, 255);
                /* Plot the points for upper and lower bounds */
                var cdf_a = jStat.binomial.cdf(a - 1, n, p);
                ggbApplet.evalCommand('A=(' + a + ',' + cdf_a + ')');
                ggbApplet.setLabelVisible('A', false);
                ggbApplet.setFixed('A', true);

                var cdf_b = jStat.binomial.cdf(b, n, p);
                ggbApplet.evalCommand('B=(' + b + ',' + cdf_b + ')');
                ggbApplet.setLabelVisible('B', false);
                ggbApplet.setFixed('B', true);

                /* Add plot notes */
                var plotNotes = '\\[\\color{red}{\\left(' + a + ',' + 'C_B(' + a + '|' + n + ',' + chopDecimals(p, 3) + ')\\right)} \\quad';
                plotNotes += '\\color{blue}{(' + b + ', C_B(' + b + '|' + n + ',' + chopDecimals(p, 3) + '))}\\]';
                plotNotes += calcDroolMessage;
                document.getElementById('plot_notes').innerHTML = plotNotes;

            } catch (err) {
                console.log('Error creating GGB Applet: ' + err);
            }
        }
    },

    /* Discrete Uniform distribution */
    /* NEEDS WORK. ZERO CAN'T BE LOWER BOUND. MIGHT BE BREAKING CALCULATOR*/
    discreteUniform: {
        displayName: 'Discrete Uniform',
        description: 'Situations that we describe as "discrete uniform situations" differ from others in that the moment we specify all of the possible outcomes of the stochastic process, we automatically get the probability of any single outcome.  This comes from the fact that in these situations we will always assume that the stochastic process is "fair", meaning that each outcome has the same probability of occurring as any other outcome. The stochastic variable of interest is a discrete numeric value. <br/><br/> The cumulative probability function (CPF/CDF) for a discrete uniform situation is $$C_{DU}\\left(x|N\\right)=\\sum^x_{i=i}\\left(\\frac{1}{N}\\times\\Delta i\\right)$$ where the parameter <i>N</i> is the total number of different outcomes of the process and $\\Delta i$ is the change between any two adjacent values; we fix the value of $\\Delta i=1$. Notice that the summation starts at 1 rather than 0; <i>i</i> is the index of the outcomes rather than the value of the stochastic variable (i.e. 1 is the first outcome, 2 is the second outcome, etc.).  The Rate of Change function (probability mass function) is defined as $$DU\\left(x|N\\right)=\\frac{1}{N}.$$ When a stochastic variable follows a discrete uniform distribution, we will write $X\\sim\\mathcal{DU}(N)$.',
        params: {
            param1: {
                paramId: 'numEvents',
                paramName: 'Number of Unique Events (<i>N</i>)',
                paramValue: 6
            },
            param2: {
                paramId: 'lowerLimit',
                paramName: 'Lower Limit',
                paramValue: 1
            },
            param3: {
                paramId: 'upperLimit',
                paramName: 'Upper Limit',
                paramValue: 3
            }
        },
        outputLabel: 'The Cumulative Probability of [Upper Limit] or a smaller value',
        computeProbability: function () {
            /* Try to get values */
            try {
                var k = Parser.eval(this.params.param1.paramValue);
                var a = Parser.eval(this.params.param2.paramValue);
                var b = Parser.eval(this.params.param3.paramValue);
            } catch (err) {
                return 'Your input is invalid.';
            }

            /*Add restrictions... make sure all values are integers, and make sure a < b */
            if (parseInt(a) != a || parseInt(b) != b || parseInt(b) < parseInt(a) || parseInt(k) != k) {
                var HTMLout = 'Your input is invalid.';
                return HTMLout;
            } else {
                k = parseInt(k);
                a = parseInt(a);
                b = parseInt(b);
            }

            /*Handle cases */
            if (a > b) {
                return 'Your lower bound must be less than your upper bound.';
            } else {
                var HTMLout = '\\[ \\sum_{i=' + a + '}^{' + b + '} \\left( \\frac{1}{' + k + '} \\times \\Delta i \\right) = ';
                HTMLout += ((1 / k) * (b - a + 1)).toFixed(decimals);
                HTMLout += '\\]';


                /*Generate plot */
                ggbApplet.reset();
                document.getElementById('plot_wrapper').style.display = 'block';
                this.plot(a, b, k);
                return HTMLout;
            }
        },
        plot: function (a, b, k) {
            try {
                /* Set Coordinates */
                ggbApplet.setCoordSystem(-0.2, Math.max(b, k) + 1, -0.2, 1.2);
                /* Define function */
                ggbApplet.evalCommand('U(x)=(floor(x)*(floor(x)+1))/(2*k)');
                ggbApplet.setLabelVisible('U', false);
                ggbApplet.setColor('U', 0, 0, 255);
                /* Plot the point now */
                ggbApplet.evalCommand('P=(' + k + ',U(' + k + '))');
                ggbApplet.setLabelVisible('P', false);
                ggbApplet.setColor('P', 255, 0, 0);
                ggbApplet.setFixed('P', true);

                /* Add plot notes */
                var plotNotes = '\\[\\color{red}{(' + k + ', C_{DU}(' + k + '|' + a + ',' + b + '))} \\]';
                document.getElementById('plot_notes').innerHTML = plotNotes;

            } catch (err) {
                console.log('Error creating GGB Applet: ' + err);
            }

        }
    },

    /* Poisson Distribution */
    poisson: {
        displayName: 'Poisson',
        description: 'A Poisson situation is closely related to a binomial situation and is useful in biology. Recall that for binomial situations, we typically imagine repeating a sequence of <i>n</i> trials. We fix the value of <i>n</i> and assume that this value is "small-ish" and does not change.  Suppose that we imagine that the number of trials is unbounded (i.e. each sequence contains an unlimited number of trials). This is the first step in imagining of Poisson situation. Poisson situations often occur when we are studying a phenomenon where we are "waiting" for the occurrence of some event.  Here "waiting" does not automatically refer to the passage of time; we also use "waiting" to refer to passage through space (e.g. moving through a forest, field, desert) or looking through some broader setting (e.g. looking through the words printed on a page for typos). The stochastic variable of interest <i>X</i> represents the number of times we saw that event while we were "waiting". Since this is a count, we are still dealing with a discrete stochastic variable.</br></br>The cumulative probability function (CPF/CDF) for a Poisson situation is $$C_{Poi}\\left(x|\\lambda\\right)=\\sum^{x}_{i=0}\\left(\\frac{e^{-\\lambda}\\lambda^{i}}{i!}\\times\\Delta i\\right)$$ where the parameter $\\lambda$ is the expected number of "successes" per a given unit (e.g. how many successes we expect to see given we "wait" 500 words, or 100 meters, or 10 minutes). In a Poisson situation, you are typically given the value of $\\lambda$ (or told an estimate). (As is usual for Discrete Situations, we assume that $\\Delta i=1$.) The Rate of Change function (probability mass function) is defined as $$Poi\\left(x|\\lambda\\right)=\\frac{e^{-\\lambda}\\lambda^x}{x!}.$$ Examples of Poisson situations include the number of phone calls in a minute to a call center, locations of a particular species within a particular area, and the number of errors found on a printed page.When a stochastic variable follows a Poisson distribution, we will write $X\\sim\\mathcal{Poi}(\\lambda)$.',
        params: {
            param1: {
                paramId: 'numEvents',
                /*This is variance lambda */
                paramName: 'Expected Number of "Events" Given size/duration ($\\lambda$)',
                paramValue: 1.5
            },
            param2: {
                paramId: 'lowerLimit',
                paramName: 'Lower Limit (value excluded when non-zero)',
                paramValue: 0
            },
            param3: {
                paramId: 'upperLimit',
                paramName: 'Upper Limit (Max Num. of Successes)',
                paramValue: 3
            }
        },
        outputLabel: 'The Cumulative Probability of [Upper Limit] or fewer occurances',
        computeProbability: function () {
            try {
                var a = Parser.eval(this.params.param2.paramValue);
                var b = Parser.eval(this.params.param3.paramValue);
                var l = Parser.eval(this.params.param1.paramValue);
            } catch (err) {
                return 'Your input is invalid.';
            }

            /* Check for non-numerics and add restrictions */
            if (parseInt(a) != a || a < 0 || parseInt(b) != b || b < 0 || b < a || parseFloat(l) != l) {
                return 'Your input is invalid. The Upper and Lower Limits must be non-negative integers.';
            } else {
                a = parseInt(a);
                b = parseInt(b);
                l = parseFloat(l);
                m = math.ceil(l);
            }
			if (a == 0) {
			var cdf_a = jStat.poisson.cdf((a - 1), l);
			var cdf_b = jStat.poisson.cdf(b, l);
            var cdf_diff = jStat.poisson.cdf(b, l) - jStat.poisson.cdf(a - 1, l);
            if ((cdf_a == 0 || cdf_a) && (cdf_b == 0 || cdf_b)) {
                var HTMLout = '\\[ \\sum_{i=' + chopDecimals(a, 3) + '}^{' + chopDecimals(b, 3) + '} \\frac{e^{' + chopDecimals(l, 3) + '}' + chopDecimals(l, 3) + '^{i}}';
                HTMLout += '{i!} = ';
                HTMLout += cdf_diff.toFixed(decimals) + '\\]';
                /*Generate Plot*/
                ggbApplet.reset();
                document.getElementById('plot_wrapper').style.display = 'block';
                this.plot(a, b, l);
                return HTMLout;
            } else {
                return 'Your input is invalid.';
            }
            }
			else {
			var cdf_a = jStat.poisson.cdf(a, l);
            var cdf_b = jStat.poisson.cdf(b, l);
            var cdf_diff = jStat.poisson.cdf(b, l) - jStat.poisson.cdf(a - 1, l);
            if ((cdf_a == 0 || cdf_a) && (cdf_b == 0 || cdf_b)) {
                var HTMLout = '\\[ \\sum_{i=' + (chopDecimals(a, 3) + 1) + '}^{' + chopDecimals(b, 3) + '} \\frac{e^{' + chopDecimals(l, 3) + '}' + chopDecimals(l, 3) + '^{i}}';
                HTMLout += '{i!} = ';
                HTMLout += cdf_diff.toFixed(decimals) + '\\]';
                /*Generate Plot*/
                ggbApplet.reset();
                document.getElementById('plot_wrapper').style.display = 'block';
                this.plot(a, b, l);
                return HTMLout;
            } else {
                return 'Your input is invalid.';
            }
            }
        },
        plot: function (a, b, l) {
            try {
                var cdf_a = jStat.poisson.cdf(a, l);
                var cdf_b = jStat.poisson.cdf(b, l);
                /* Set Coords */
                ggbApplet.setCoordSystem(-b / 5, 2 * m + 4, -0.2, 1.2);
                ggbApplet.evalCommand('P = Poisson[' + l + ',true]');
                ggbApplet.setColor('P', 0, 0, 255);
                ggbApplet.setLabelVisible('P', false);
                /* Plot point */
                ggbApplet.evalCommand('A=(' + a + ',' + cdf_a + ')');
                ggbApplet.setLabelVisible('A', false);
                ggbApplet.setColor('A', 255, 0, 0);
                ggbApplet.setFixed('A', true);
                ggbApplet.evalCommand('B=(' + b + ',' + cdf_b + ')');
                ggbApplet.setLabelVisible('B', false);
                ggbApplet.setColor('B', 0, 0, 255);
                ggbApplet.setFixed('B', true);

                /* Add plot notes */
                var plotNotes = '\\[\\color{red}{(' + a + ',C_{Poi}(' + a + '|' + chopDecimals(l, 3) + '))} \\quad';
                plotNotes += '\\color{blue}{(' + b + ',C_{Poi}(' + b + '|' + chopDecimals(l, 3) + '))} \\]';
                plotNotes += calcDroolMessage;
                document.getElementById('plot_notes').innerHTML = plotNotes;

            } catch (err) {
                console.log('Error creating GGB Applet: ' + err);
            }


        }
    },

    /* Continuous Uniform Distribution */
    continuousUniform: {
        displayName: 'Continuous Uniform',
        description: 'Continuous Uniform situations are much like Discrete Uniform situations. However, there are two important differences.  First, in the Continuous Uniform situation, the stochastic variable of interest may take on any conceivable value in a given interval.  If the given interval is $[0,10]$, then we could observe (ignoring measurement errors) an object which has the value of $\\pi$ or $\\sqrt[2]{2}$ in addition to values like 3 and 7.5. The second way that a Continuous Uniform situation is different from a Discrete Uniform situation is in what we assume is "fair" (i.e. the same) for all values of the stochastic variable.  In the Continuous Uniform situation, we will assume that there is a <i>Constant Rate of Change</i> function (PDF) defined as $$CU\\left(x|a,b\\right)=\\begin{cases}\\frac{1}{b-a}&\\text{ if }a\\leq x\\leq b\\\\0&\\text{ otherwise.}\\end{cases}$$ where the parameter <i>a</i> is the smallest possible value that the stochastic variable may take on and the parameter <i>b</i> is the largest possible value.<br/><br/> The cumulative probability function (CPF/CDF) for a Continuous Uniform situation is given by $$C_{CU}\\left(x|a,b\\right)=\\begin{cases} 0 & \\text{ if } x &lt; a \\\\ \\frac{x-a}{b-a}&\\text{ if } a\\leq x\\leq b\\\\1&\\text{ if } x &gt; b.\\end{cases}$$ When a stochastic variable follows a continuous distribution, we will write $X\\sim\\mathcal{Uni}(a,b)$.',
        params: {
            param1: {
                paramId: 'lowerLimit',
                paramName: 'Lower Limit of Interval (<i>a</i>)',
                paramValue: 0
            },
            param2: {
                paramId: 'upperLimit',
                paramName: 'Upper Limit of Interval (<i>b</i>)',
                paramValue: 1
            },
            param3: {
                paramId: 'lowerLimitAccumulation',
                paramName: 'Lower Limit of Accumulation',
                paramValue: 0.1
            },
            param4: {
                paramId: 'upperLimitAccumulation',
                paramName: 'Upper Limit of Accumulation',
                paramValue: 0.34
            }
        },
        outputLabel: 'The Cumulative Probability of [Upper Limit] or smaller value',
        computeProbability: function () {
            /* Collect parameter values */
            try {
                var aInt = Parser.eval(this.params.param1.paramValue);
                var bInt = Parser.eval(this.params.param2.paramValue);
                var aAccum = Parser.eval(this.params.param3.paramValue);
                var bAccum = Parser.eval(this.params.param4.paramValue);
            } catch (err) {
                return 'Your input is invalid.';
            }

            /*Escape if any non-numeric inputs occur, add restrictions */
            if (parseFloat(aInt) != aInt || parseFloat(bInt) != bInt || parseFloat(bInt) < parseFloat(aInt) || parseFloat(aAccum) != aAccum || parseFloat(bAccum) != bAccum || parseFloat(bAccum) < parseFloat(aAccum)) {
                return 'Your input is invalid. Make sure the lower limit of the interval is no greater than the upper limit of the interval, and make sure the lower limit of accumulation is no greater than the upper limit of accumulation.';
            } else { /*Otherwise parse to floats */
                aInt = parseFloat(aInt);
                bInt = parseFloat(bInt);
                aAccum = parseFloat(aAccum);
                bAccum = parseFloat(bAccum);
            }

            /* Add some restrictions */
            if (bAccum < aInt) {
                var HTMLout = 'Cumulative Probability equals 0: the end of accumulation occurs before the start of the interval of the uniform distribution.';
                /*Generate Plot*/
                ggbApplet.reset();
                document.getElementById('plot_wrapper').style.display = 'block';
                this.plot(aInt, bInt, aAccum, bAccum);
                /*Return JaX*/
                return HTMLout;
            } else if (aAccum > bInt) {
                var HTMLout = 'Cumulative Probability equals 0: the start of accumulation occurs after the end of the uniform distribution.';
                /*Generate Plot*/
                ggbApplet.reset();
                document.getElementById('plot_wrapper').style.display = 'block';
                this.plot(aInt, bInt, aAccum, bAccum);
                /*Return JaX*/
                return HTMLout;
            } else if (aAccum <= aInt && bAccum >= aInt) {
                var HTMLout = '\\[\\frac{(' + chopDecimals(Math.min(bAccum, bInt), 3) + ')-(' + chopDecimals(aInt, 3) + ')}';
                HTMLout += '{(' + chopDecimals(bInt, 3) + ')-(' + chopDecimals(aInt, 3) + ')} =' + ((Math.min(bAccum, bInt) - aInt) / (bInt - aInt)).toFixed(decimals) + '\\]';
                /*Generate Plot*/
                ggbApplet.reset();
                document.getElementById('plot_wrapper').style.display = 'block';
                this.plot(aInt, bInt, aAccum, bAccum);
                /*Return JaX*/
                return HTMLout;
            } else if (aAccum >= aInt && bAccum <= bInt) {
                var HTMLout = '\\[\\frac{(' + chopDecimals(bAccum, 3) + ')-(' + chopDecimals(aAccum, 3) + ')}';
                HTMLout += '{(' + chopDecimals(bInt, 3) + ')-(' + chopDecimals(aInt, 3) + ')} = ' + ((bAccum - aAccum) / (bInt - aInt)).toFixed(decimals) + '\\]';
                /*Generate Plot*/
                ggbApplet.reset();
                document.getElementById('plot_wrapper').style.display = 'block';
                this.plot(aInt, bInt, aAccum, bAccum);
                /*Return JaX*/
                return HTMLout;
            } else if (aAccum <= bInt && bAccum >= bInt) {
                var HTMLout = '\\[\\frac{(' + chopDecimals(bInt, 3) + ')-(' + chopDecimals(aAccum, 3) + ')}';
                HTMLout += '{(' + chopDecimals(bInt, 3) + ')-(' + chopDecimals(aInt, 3) + ')}=' + ((bInt - aAccum) / (bInt - aInt)).toFixed(decimals) + '\\]';
                /*Generate Plot*/
                ggbApplet.reset();
                document.getElementById('plot_wrapper').style.display = 'block';
                this.plot(aInt, bInt, aAccum, bAccum);
                /*Return JaX*/
                return HTMLout;
            } else if (aAccum <= aInt && bAccum >= bInt) {
                var HTMLout = '\\[\\frac{(' + chopDecimals(bInt, 3) + ')-(' + chopDecimals(aInt, 3) + ')}';
                HTMLout += '{(' + chopDecimals(bInt, 3) + ')-(' + chopDecimals(aInt, 3) + ')} = 1 \\]';
                /*Generate Plot*/
                ggbApplet.reset();
                document.getElementById('plot_wrapper').style.display = 'block';
                this.plot(aInt, bInt, aAccum, bAccum);
                /*Return JaX*/
                return HTMLout;
            } else {
                console.log('catch');
                return 'Your input is invalid.';
            }
        },
        plot(aInt, bInt, aAccum, bAccum) {
            try {
                var intWidth = bInt - aInt;
                ggbApplet.setCoordSystem(Math.min(aInt, aAccum) - 0.5 * intWidth, Math.max(bInt, bAccum) + 0.5 * intWidth, -0.2, 1.2);
                /* Define function */
                ggbApplet.evalCommand('Acc(x)=If[x<' + aInt + ',0, If[x>' + bInt + ',1, 1/' + intWidth + '*(x-' + aInt + ')]]');
                ggbApplet.setColor('Acc', 0, 0, 255);
                ggbApplet.setLabelVisible('Acc', false);
                /* Define Points */
                ggbApplet.evalCommand('A=(' + aAccum + ',Acc(' + aAccum + '))');
                ggbApplet.setColor('A', 255, 0, 0);
                ggbApplet.setLabelVisible('A', false);
                ggbApplet.setFixed('A', true);
                ggbApplet.evalCommand('B=(' + bAccum + ',Acc(' + bAccum + '))');
                ggbApplet.setColor('B', 0, 0, 255);
                ggbApplet.setLabelVisible('B', false);
                ggbApplet.setFixed('B', true);

                /* Add plot notes */
                var plotNotes = '\\[\\color{red}{(' + aAccum + ',C_U(' + chopDecimals(aAccum, 3) + '|' + chopDecimals(aInt, 3) + ',' + chopDecimals(bInt, 3) + '))} \\qquad';
                plotNotes += '\\color{blue}{(' + chopDecimals(bAccum, 3) + ',C_U(' + chopDecimals(bAccum, 3) + '|' + chopDecimals(aInt, 3) + ',' + chopDecimals(bInt, 3) + '))} \\]';
                document.getElementById('plot_notes').innerHTML = plotNotes;

            } catch (err) {
                console.log('Error creating GGB Applet: ' + err);
            }
        }
    },

    /* Normal Distribution */
    normal: {
        displayName: 'Normal (Gaussian)',
        description: 'When we are dealing with whole (entire) populations that include individuals of any type (e.g. we don\'t separate out by another stochastic variable; looking at just members with XX chromosomes) and the stochastic variable of interest is continuous, then we could be dealing with a normal situation. (The term "normal" does not imply that this is the "standard" type of situation or that every other situation is "abnormal"; the term "normal" comes from set of equations and approach the built the mathematical theory behind this type of situation. Mathematician C. F. Gauss introduced this type of distribution; hence the alternative name, Gaussian.) Normal situations (distributions) are some of the most well-studied situations and stochastic processes. Due to this, normal situations are often the easiest to work with mathematically and easy for people to think about and visualize.  In fact, in more complex settings, we can "standardize"/"normalize" the stochastic variable so that we can make use of the niceties of normal situations.</br></br>The Rate of Change (PDF) function for normal situations is defined as $$N\\left(x|\\mu,\\sigma^2\\right)=\\frac{1}{\\sqrt[2]{2\\pi\\sigma^2}}\\text{exp}\\left(-\\frac{\\left(x-\\mu\\right)^2}{2\\sigma^2}\\right)$$ where $\\mu$ is the expected value of the stochastic variable and the parameter $\\sigma^2$ is the variance of the stochastic variable.  The behavior of the stochastic variable matters greatly in normal situations. Unlike the continuous uniform situation where the stochastic variable\'s value is bounded, we assume that the stochastic variable\'s value in a normal situation is completely unbounded. (That is to say that we imagine (or in theory) the stochastic variable could take on any real number as a value; what we imagine or say in theory is not necessarily the same as in practice.) The expression "$\\text{exp}\\left(a\\right)$" is the same as writing "$e^{a}$".</br></br>The cumulative probability function (CPF/CDF) for a normal situation is defined as $$C_N\\left(x|\\mu,\\sigma^2\\right)=\\int_{-\\infty}^xN\\left(t|\\mu,\\sigma^2\\right)\\cdot dt$$<br><br>A "Standard Normal Distribution" is a special case of the Normal (Gaussian) distribution. Consider a stochastic variable, <i>X</i> which we know follows a Normal distribution with a known expected value of $\\mu$ and a known value of variance of $\\sigma^2$; written as $X\\sim\\mathcal{N}\\left(\\mu,\\sigma^2\\right)$. If we transform all of the observations of <i>X</i> by first subtracting the expected value and then dividing by the square root of the variance, we would get a new set of values; specifically define $z_i$ as $$z_i=\\frac{x_i-\\mu}{\\sqrt[2]{\\sigma^2}}$$ This transformation is called "standardization". The stochastic variable <i>Z</i>, a.k.a. the "Standardized form of <i>X</i>" follows a "Standard Normal Distribution" with expected value of 0 and a variance value of 1; $Z\\sim\\mathcal{N}\\left(0,1\\right)$.',
        params: {
            param1: {
                paramId: 'expectedValue',
                paramName: 'Expected Value ($\\mu$)',
                paramValue: 0
            },
            param2: {
                paramId: 'variance',
                paramName: 'Variance ($\\sigma^2$)',
                paramValue: 1
            },
            param3: {
                paramId: 'lowerLimit',
                paramName: 'Lower Limit',
                paramValue: 0.2
            },
            param4: {
                paramId: 'upperLimit',
                paramName: 'Upper Limit',
                paramValue: 0.4
            }
        },
        outputLabel: 'The Cumulative Probability of [Upper Limit] or smaller value',
        computeProbability: function () {
            /* Try to get values */
            try {
                var a = Parser.eval(this.params.param3.paramValue);
                var b = Parser.eval(this.params.param4.paramValue);
                var mean = Parser.eval(this.params.param1.paramValue);
                var sv = Parser.eval(this.params.param2.paramValue);
            } catch (err) {
                return 'Your input is invalid.';
            }
            /* Break if any non-numeric items enter */
            if ((parseFloat(a) != a && a != '-oo') || parseFloat(b) != b || parseFloat(mean) != mean || parseFloat(sv) != sv) {
                return 'Your input is invalid.';
            } else {
                a = a == '-oo' ? '-oo' : parseFloat(a);
                b = parseFloat(b);
                mean = parseFloat(mean);
                std = parseFloat(Math.sqrt(sv));
            }

            if (a == '-oo') {
                var HTMLout = '\\[ \\int\\limits_{-\\infty}^{' + chopDecimals(b, 3) + '} \\frac{1}{\\sqrt{2\\pi \\cdot' + chopDecimals(sv, 3) + '^2}}';
                HTMLout += 'e^{\\frac{-(t-' + chopDecimals(mean, 3) + ')^2}{2\\cdot' + chopDecimals(sv, 3) + '}} dt = ' + (jStat.normal.cdf(b, mean, std)).toFixed(decimals);
                HTMLout += '\\]';
                /*Generate plot */
                ggbApplet.reset();
                document.getElementById('plot_wrapper').style.display = 'block';
                this.plot(a, b, mean, std);
                /*Return the JaX */
                return HTMLout;
            } else {
                var HTMLout = '\\[ \\int\\limits_{' + chopDecimals(a, 3) + '}^{' + chopDecimals(b, 3) + '} \\frac{1}{\\sqrt{2\\pi \\cdot' + chopDecimals(sv, 3) + '}}';
                HTMLout += 'e^{\\frac{-(t-' + chopDecimals(mean, 3) + ')^2}{2\\cdot' + chopDecimals(sv, 3) + '}} dt = ' + (jStat.normal.cdf(b, mean, std) - jStat.normal.cdf(a, mean, std)).toFixed(decimals);
                HTMLout += '\\]';
                /*Generate plot */
                ggbApplet.reset();
                document.getElementById('plot_wrapper').style.display = 'block';
                this.plot(a, b, mean, std);
                /*Return the JaX */
                return HTMLout;
            }
        },
        plot: function (a, b, mean, std) {
            try {
                /*First set coordinates */
                ggbApplet.setCoordSystem(mean - 5 * std, mean + 5 * std, -0.2, 1.2);
                /* Plot distribution */
                ggbApplet.evalCommand('N(x)=Normal[' + mean + ',' + std + ',x,true]');
                ggbApplet.setLabelVisible('N', false);
                ggbApplet.setColor('N', 0, 0, 255);
                /* Plot points */
                a = a == '-oo' ? mean - 10 * std : a;
                ggbApplet.evalCommand('A=(' + a + ',N(' + a + '))');
                ggbApplet.setColor('A', 255, 0, 0);
                ggbApplet.setFixed('A', true);
                ggbApplet.setLabelVisible('A', false);
                ggbApplet.evalCommand('B=(' + b + ',N(' + b + '))');
                ggbApplet.setColor('B', 0, 0, 255);
                ggbApplet.setFixed('B', true);
                ggbApplet.setLabelVisible('B', false);

                /* Add plot notes */
                var plotNotes = '\\[\\color{red}{(' + chopDecimals(a, 3) + ',C_N(' + chopDecimals(a, 3) + '|' + chopDecimals(mean, 3) + ',' + chopDecimals(std, 3) + '))} \\qquad';
                plotNotes += '\\color{blue}{(' + chopDecimals(b, 3) + ',C_N(' + chopDecimals(b, 3) + '|' + chopDecimals(mean, 3) + ',' + chopDecimals(std, 3) + '))} \\]';
                document.getElementById('plot_notes').innerHTML = plotNotes;

            } catch (err) {
                console.log('Error creating GGB Applet: ' + err);
            }
        }
    },

    /* Student's t Distribution */
    studentsT: {
        displayName: '(A.) Student\'s <i>t</i>',
        description: 'The (A.) Student\'s <i>t</i> distribution is named after the pseudonym "A. Student". The original developer was William Gosset, a statistician employed by the Guinness brewery, which had a policy where employee\'s could not publish their work. The underlying situation for Student\'s <i>t</i> is very similar to that of Normal situations. However, there are two important differences: the sample size is small and we do not know the value of the population variance. In the case of the first difference (small sample size), we no longer have access to the entire population as we do in the Normal (Gaussian) setting. For the second difference, we know that there is a value for the population variance, we just don\'t have a solid grip on that value. To use Student\'s <i>t</i>, we will assume that observed values in our data collection follow a Normal (Gaussian) distribution if we had access to the entire population. <br><br>The Rate of Change function (PDF) for Student\'s <i>t</i> is defined as $$t\\left(x|\\nu\\right)=\\frac{\\Gamma\\left(\\frac{\\nu+1}{2}\\right)}{\\sqrt[2]{\\nu\\pi}\\;\\cdot\\Gamma\\left(\\frac{\\nu}{2}\\right)}\\left(1+\\frac{x^2}{\\nu}\\right)^{-\\frac{\\nu+1}{2}}$$ where $\\nu$ is the degrees of freedom (the size of the sample less the number of parameters we\'ve estimated; in this case $\\nu=n-1$) and the "Gamma" ( $\\Gamma$ ) function. <br><br>The cumulative probability function  (CPF/CDF) for a Student\'s <i>t</i> is defined as $$C_t\\left(x|\\nu\\right)=\\int_{-\\infty}^xt\\left(u|\\nu\\right)\\cdot du$$ When a stochastic variable follows a Student\'s <i>t</i> distribution, we will write $X\\sim t(\\nu)$.',
        params: {
            param1: {
                paramId: 'degreeFreedom',
                paramName: 'Degrees of Freedom ($\\nu$)',
                paramValue: 1
            },
            param2: {
                paramId: 'lowerLimit',
                paramName: 'Lower Limit',
                paramValue: 0
            },
            param3: {
                paramId: 'upperLimit',
                paramName: 'Upper Limit',
                paramValue: 1.376
            }
        },
        outputLabel: 'The Cumulative Probability of [Upper Limit] or smaller value',
        computeProbability: function () {
            /* Try to get values */
            try {
                var a = Parser.eval(this.params.param2.paramValue);
                var b = Parser.eval(this.params.param3.paramValue);
                var DoF = Parser.eval(this.params.param1.paramValue);
            } catch (err) {
                return 'Your input is invalid.';
            }

            /* Break if non-numerics appear, check restrictions */
            if ((parseFloat(a) != a && a != '-oo') || parseFloat(b) != b || parseFloat(DoF) != DoF || DoF < 1) {
                return 'Your input is invalid.';
            } else {
                a = a == '-oo' ? '-oo' : parseFloat(a);
                b = parseFloat(b);
                DoF = parseFloat(DoF);
            }

            if (a == '-oo') {
                var HTMLout = '\\[ \\int\\limits_{-\\infty}^{' + chopDecimals(b, 3) + '} \\frac{';
                HTMLout += '\\Gamma \\left( \\frac{' + DoF + '+1}{2}\\right)}{\\Gamma \\left( \\frac{' + DoF + '}{2}\\right)}';
                HTMLout += '\\cdot \\frac{1}{\\sqrt{' + DoF + '\\cdot \\pi}} \\cdot';
                HTMLout += '\\frac{1}{\\left( 1+ \\left( \\frac{t^2}{' + DoF + '}\\right) \\right)^{(' + DoF + '+1)/2}} \\,  dt';
                HTMLout += '=' + (jStat.studentt.cdf(b, DoF)).toFixed(decimals) + '\\]';
                /*Generate Plot*/
                ggbApplet.reset();
                document.getElementById('plot_wrapper').style.display = 'block';
                this.plot(a, b, DoF);
                /*Return the JaX*/
                return HTMLout;
            } else {
                if ((jStat.studentt.cdf(a, DoF) == 0 || jStat.studentt.cdf(a, DoF)) && (jStat.studentt.cdf(b, DoF) == 0 || jStat.studentt.cdf(b, DoF))) {
                    var HTMLout = '\\[ \\int\\limits_{' + chopDecimals(a, 3) + '}^{' + chopDecimals(b, 3) + '} \\frac{';
                    HTMLout += '\\Gamma \\left( \\frac{' + DoF + '+1}{2}\\right)}{\\Gamma \\left( \\frac{' + DoF + '}{2}\\right)}';
                    HTMLout += '\\cdot \\frac{1}{\\sqrt{' + DoF + '\\cdot \\pi}} \\cdot';
                    HTMLout += '\\frac{1}{\\left( 1+ \\left( \\frac{t^2}{' + DoF + '}\\right) \\right)^{(' + DoF + '+1)/2}} \\,  dt';
                    HTMLout += '=' + (jStat.studentt.cdf(b, DoF) - jStat.studentt.cdf(a, DoF)).toFixed(decimals) + '\\]';
                    /*Generate Plot*/
                    ggbApplet.reset();
                    document.getElementById('plot_wrapper').style.display = 'block';
                    this.plot(a, b, DoF);
                    /*Return the JaX*/
                    return HTMLout;
                } else {
                    return 'Your input is invalid.';
                }
            }
        },
        plot: function (a, b, DoF) {
            try {
                ggbApplet.setCoordSystem(Math.min(a, -7) - 2, Math.max(b, 7) + 2, -0.2, 1.2);
                ggbApplet.evalCommand('T(x)=TDistribution[' + DoF + ',x,true]');
                ggbApplet.setLabelVisible('T', false);
                ggbApplet.setColor('T', 0, 0, 255);
                /*Plot the points */
                ggbApplet.evalCommand('A=(' + a + ',T(' + a + '))');
                ggbApplet.setColor('A', 255, 0, 0);
                ggbApplet.setFixed('A', true);
                ggbApplet.setLabelVisible('A', false);

                ggbApplet.evalCommand('B=(' + b + ',T(' + b + '))');
                ggbApplet.setColor('B', 0, 0, 255);
                ggbApplet.setFixed('B', true);
                ggbApplet.setLabelVisible('B', false);

                /* Add some plot notes */
                var plotNotes = '\\[\\color{red}{(' + chopDecimals(a, 3) + ', C_t(' + chopDecimals(a, 3) + '|' + DoF + '))} \\qquad';
                plotNotes += '\\color{blue}{(' + chopDecimals(b, 3) + ', C_t(' + chopDecimals(b, 3) + '|' + DoF + '))} \\]';
                document.getElementById('plot_notes').innerHTML = plotNotes;

            } catch (err) {
                console.log('Error creating GGB Applet: ' + err);
            }
        }
    },

    /*Chi Squared Distribution */
    chisquared: {
        displayName: 'Chi-Squared (&chi;<sup>2</sup>)',
        description: 'The $\\chi^2$ distribution grew out of investigating the variance parameter of Normal distributions. We often use the $\\chi^2$ distribution (and the associated tests) when our research question is either <ul><li>"Are these multiple groups actually different from each other?" (Analysis of Variance-ANOVA, ANCOVA, MANOVA, MANCOVA)</li> <li>"How do we predict this stochastic variable using these other stochastic variables?" (Regression-Estimating Slope Parameters)</li><li>"Is stochastic variable A independent of stochastic variable B?" (Test for Independence)</li><li>"Given the data collection, are our data consistent with our theory?" (Pearson\'s Goodness of Fit Test)</li></ul> The generation of a stochastic variable that has a $\\chi^2$ distribution is fairly straightforward. Starting with a normally distributed stochastic variable, say <i>X</i>, standardize <i>X</i> and then square that result. This result has a $\\chi^2$ distribution with one degree of freedom.<br><br>The degrees of freedom ($\\nu$) for $\\chi^2$ distributions depends on the situation and the test.<ul><li>If your situation involves adding up <i>m</i> independent of stochastic variables each of which have a $\\chi^2$ with one degree of freedom, then the sum has a $\\chi^2$ distribution with <i>m</i> degrees of freedom.</li> <li>Testing Independence: the total number of observations has minimal impact on degrees of freedom, rather the number of categories for each stochastic variable is more important. If you build a two-way contingency table for your situation, the degrees of freedom will $(r-1)(c-1)$ where <i>r</i> is the number of rows and <i>c</i> the number of columns.</li> <li>Goodness of Fit: here you want to check to see if your data is consistent with your theory. Your theory must include some specified distribution. If there are <i>k</i> possible values of the stochastic variable (from your theory), then your degrees of freedom is $k-1$. This is provided any parameters for your theory are specified. If you have any unspecified parameters, then you will reduce the degrees of freedom by 1 for each parameter you estimate. For example, if you estimate two parameters from the data, your actual degrees of freedom will be $k-1-2$.</li> </ui>The Rate of Change function (PDF) for a $\\chi^2$ distribution with $\\nu$ degrees of freedom is defined as $$f\\left(x|\\nu\\right)=\\begin{cases}\\frac{x^{((\\nu/2)-1)}e^{-x/2}}{2^{\\nu/2}\\cdot\\Gamma\\left(\\frac{\\nu}{2}\\right)}&\\text{ if }x \\ge 0\\\\0&\\text{ otherwise.}\\end{cases}$$The cumulative probability function (CPF/CDF) is defined as $$C_{\\chi^2}\\left(x|\\nu\\right)=\\int_0^xf(t|\\nu)\\cdot dt$$ When a stochastic variable follows a $\\chi^2$ distribution with $\\nu$ degrees of freedom, we will write $X\\sim\\chi^2(\\nu)$.',
        params: {
            param1: {
                paramId: 'DoF',
                paramName: 'Degrees of Freedom ($\\nu$)',
                paramValue: 1
            },
            param2: {
                paramId: 'lowerLimit',
                paramName: 'Lower Limit',
                paramValue: 0
            },
            param3: {
                paramId: 'upperLimit',
                paramName: 'Upper Limit',
                paramValue: 1.5
            }
        },
        outputLabel: 'The Cumulative Probability of [Upper Limit] or smaller value',
        computeProbability: function () {
            /* Try to get values */
            try {
                var a = Parser.eval(this.params.param2.paramValue);
                var b = Parser.eval(this.params.param3.paramValue);
                var DoF = Parser.eval(this.params.param1.paramValue);
            } catch (err) {
                return 'Your input is invalid.';
            }

            /* Check for non-numerics */
            if ((parseFloat(a) != a && a != '-oo') || parseFloat(b) != b || parseFloat(DoF) != DoF) {
                return 'Your input is invalid.';
            } else {
                a = a == '-oo' ? '-oo' : parseFloat(a);
                b = parseFloat(b);
                DoF = parseFloat(DoF);
            }

            if (a == '-oo') {
                var HTMLout = '\\[ \\int\\limits_{-\\infty}^{' + chopDecimals(b, 3) + '} \\frac{1}{\\Gamma \\left(\\frac{' + DoF + '}{2} \\right) \\cdot 2^{' + DoF + '/2}}';
                HTMLout += '\\cdot t^{(' + DoF + '/2)-1} e^{-t/2} \\, dt = ';
                HTMLout += (jStat.chisquare.cdf(b, DoF)).toFixed(decimals) + '\\]';
                /*Generate plot*/
                ggbApplet.reset();
                document.getElementById('plot_wrapper').style.display = 'block';
                this.plot(DoF, a, b);

                return HTMLout;
            } else {
                if ((jStat.chisquare.cdf(a, DoF) == 0 || jStat.chisquare.cdf(a, DoF)) && (jStat.chisquare.cdf(a, DoF) == 0 || jStat.chisquare.cdf(a, DoF))) {
                    var HTMLout = '\\[ \\int\\limits_{' + chopDecimals(a, 3) + '}^{' + chopDecimals(b, 3) + '} \\frac{1}{\\Gamma \\left(\\frac{' + DoF + '}{2} \\right) \\cdot 2^{' + DoF + '/2}}';
                    HTMLout += '\\cdot t^{(' + DoF + '/2)-1} e^{-t/2} \\, dt = ';
                    HTMLout += (jStat.chisquare.cdf(b, DoF) - jStat.chisquare.cdf(a, DoF)).toFixed(decimals) + '\\]';
                    /*Generate Plot*/
                    ggbApplet.reset();
                    document.getElementById('plot_wrapper').style.display = 'block';
                    this.plot(DoF, a, b);
                    /*Return HTMLout - JaX code*/
                    return HTMLout;
                } else {
                    return 'Your input is invalid.';
                }
            }
        },
        plot: function (DoF, a, b) {
            try {
                /* Change axes first */
                ggbApplet.setCoordSystem(-1, 1.5 * b, -0.2, 1.2);
                /* Plot the distribution first */
                ggbApplet.evalCommand('f(x)=If[x>=0,ChiSquared[' + DoF + ',x,true]]');
                ggbApplet.setLabelVisible('f', false);
                ggbApplet.setColor('f', 0, 0, 255);
                /* Plot the points */
                ggbApplet.evalCommand('A=(' + a + ',f(' + a + '))');
                ggbApplet.setColor('A', 255, 0, 0);
                ggbApplet.setFixed('A', true);
                ggbApplet.setLabelVisible('A', false);
                ggbApplet.evalCommand('B=(' + b + ',f(' + b + '))');
                ggbApplet.setColor('B', 0, 0, 255);
                ggbApplet.setFixed('B', true);
                ggbApplet.setLabelVisible('B', false);

                /* Add plot notes */
                var plotNotes = '\\[ \\color{red}{(' + chopDecimals(a, 3) + ',C_{\\chi^2}(' + chopDecimals(a, 3) + '|' + DoF + '))} \\quad';
                plotNotes += '\\color{blue}{(' + chopDecimals(b, 3) + ',C_{\\chi^2}(' + chopDecimals(b, 3) + '|' + DoF + '))} \\]';

                document.getElementById('plot_notes').innerHTML = plotNotes;

            } catch (err) {
                console.log('Error creating GGB Applet: ' + err);
            }
        }
    },

    /*F test */
    centralF: {
        displayName: 'F',
        description: 'The (Central) F distribution (more formally, Snedecor\'s <i>F</i> distribution) is very useful in answering the some of the same sorts of questions as the $\\chi^2$ distribution. In particular, we use the <i>F</i> to answer questions about multiple groups being different (Analysis of Variance) and prediction (Regression-Model level). In essence, when we form the ratio of two independent sums of squares, we are essentially looking at a new stochastic variable (the ratio) that follows the <i>F</i> distribution. For formally, if $X\\sim\\chi^2(a)$ (<i>X</i> has a $\\chi^2$ distribution with <i>a</i> degrees of freedom), $Y\\sim\\chi^2(b)$ (<i>Y</i> has a $\\chi^2$ distribution with <i>b</i> degrees of freedom), and <i>X</i> and <i>Y</i> are independent of each other, then when we define $W=\\frac{X/a}{Y/b}$ we say that <i>W</i> has an <i>F</i> distribution with degrees of freedom <i>a</i> and <i>b</i>. Notice that the two necessary parameters for the <i>F</i> distribution are the two degrees of freedom from the two $\\chi^2$ distributed stochastic variables.</br></br>The Rate of Change function (PDF) for an <i>F</i> distribution with $\\nu_1$ and $\\nu_2$ degrees of freedom is defined as $$g\\left(x|\\nu_1,\\nu_2\\right)=\\begin{cases}\\frac{\\Gamma\\left(\\frac{\\nu_1+\\nu_2}{2}\\right)}{\\Gamma\\left(\\frac{\\nu_1}{2}\\right)\\Gamma\\left(\\frac{\\nu_2}{2}\\right)}\\cdot\\left(\\frac{\\nu_1}{\\nu_2}\\right)^{\\nu_1/2}\\cdot\\frac{x^{\\frac{\\nu_1-2}{2}}}{\\left(1+\\left(\\frac{\\nu_1}{\\nu_2}\\right)x\\right)^{(\\nu_1+\\nu_2)/2}}&\\text{ if }x &gt; 0\\\\0&\\text{ otherwise.}\\end{cases}$$The cumulative probability function (CPF/CDF) is defined as $$C_F\\left(X|\\nu_1,\\nu_2\\right)=\\int_0^xg\\left(t|\\nu_1,\\nu_2\\right)\\cdot dt$$When a stochastic variable follows a <i>F</i> distribution, we will write $X\\sim F(\\nu_1,\\nu_2)$.',
        params: {
            param1: {
                paramId: 'DoF1',
                paramName: 'Degrees of Freedom (Numerator, $\\nu_1$)',
                paramValue: 2
            },
            param2: {
                paramId: 'DoF2',
                paramName: 'Degrees of Freedom (Denominator, $\\nu_2$)',
                paramValue: 4
            },
            param3: {
                paramId: 'lowerLimit',
                paramName: 'Lower Limit',
                paramValue: 0
            },
            param4: {
                paramId: 'upperLimit',
                paramName: 'Upper Limit',
                paramValue: 3
            }
        },
        outputLabel: 'The Cumulative Probability of [Upper Limit] or smaller value',
        computeProbability: function () {
            /* Try to get values */
            var a = Parser.eval(this.params.param3.paramValue);
            var b = Parser.eval(this.params.param4.paramValue);
            var DoF1 = Parser.eval(this.params.param1.paramValue);
            var DoF2 = Parser.eval(this.params.param2.paramValue);

            /* Check for non-numerics */
            if ((parseFloat(a) != a && a != '-oo') || parseFloat(b) != b || parseFloat(DoF1) != DoF1 || parseFloat(DoF2) != DoF2) {
                return 'Your input is invalid.';
            } else {
                a = a == '-oo' ? '-oo' : parseFloat(a);
                b = parseFloat(b);
                DoF1 = parseFloat(DoF1);
                DoF2 = parseFloat(DoF2);
            }

            if (a == '-oo') {
                var HTMLout = '\\[ \\int\\limits_{-\\infty}^{' + chopDecimals(b, 3) + '}' + '\\frac{ \\Gamma \\left( \\frac{' + DoF1 + '+' + DoF2 + '}{2}\\right) }';
                HTMLout += '{\\Gamma \\left( \\frac{' + DoF1 + '}{2}\\right) \\Gamma \\left( \\frac{' + DoF2 + '}{2} \\right) }';
                HTMLout += '\\left( \\frac{' + DoF1 + '}{' + DoF2 + '}\\right)^{' + DoF1 + '/2}';
                HTMLout += '\\frac{t^{(' + DoF1 + '-2)/2}}{ \\left( 1 + \\left(\\frac{' + DoF1 + '}{' + DoF2 + '}\\right) t \\right)^{(' + DoF1 + '+' + DoF2 + ')/2}} \\, dt = ';
                HTMLout += (jStat.centralF.cdf(b, DoF1, DoF2)).toFixed(decimals) + '\\]';
                /*Generate plot */
                ggbApplet.reset();
                document.getElementById('plot_wrapper').style.display = 'block';
                this.plot(DoF1, DoF2, a, b);
                /*Return the JaX*/
                return HTMLout;
            } else {
                if ((jStat.centralF.cdf(a, DoF1, DoF2) == 0 || jStat.centralF.cdf(a, DoF1, DoF2)) && (jStat.centralF.cdf(b, DoF1, DoF2) == 0 || jStat.centralF.cdf(b, DoF1, DoF2))) {
                    var HTMLout = '\\[ \\int\\limits_{' + chopDecimals(a, 3) + '}^{' + chopDecimals(b, 3) + '}' + '\\frac{ \\Gamma \\left( \\frac{' + DoF1 + '+' + DoF2 + '}{2}\\right) }';
                    HTMLout += '{\\Gamma \\left( \\frac{' + DoF1 + '}{2}\\right) \\Gamma \\left( \\frac{' + DoF2 + '}{2} \\right) }';
                    HTMLout += '\\left( \\frac{' + DoF1 + '}{' + DoF2 + '}\\right)^{' + DoF1 + '/2}';
                    HTMLout += '\\frac{t^{(' + DoF1 + '-2)/2}}{ \\left( 1 + \\left(\\frac{' + DoF1 + '}{' + DoF2 + '}\\right) t \\right)^{(' + DoF1 + '+' + DoF2 + ')/2}} \\, dt = ';
                    HTMLout += (jStat.centralF.cdf(b, DoF1, DoF2) - jStat.centralF.cdf(a, DoF1, DoF2)).toFixed(decimals) + '\\]';
                    /*Generate plot */
                    ggbApplet.reset();
                    document.getElementById('plot_wrapper').style.display = 'block';
                    this.plot(DoF1, DoF2, a, b);
                    /*Return the JaX*/
                    return HTMLout;
                } else {
                    return 'Your input is invalid.';
                }
            }
        },
        plot: function (DoF1, DoF2, a, b) {
            try {
                /*Set up coordinates */
                var maxX = Math.max(10, b + 1);
                ggbApplet.setCoordSystem(-maxX / 10, maxX, -0.2, 1.2);
                /*Create the F distribution */
                ggbApplet.evalCommand('F(x)=If[x>=0,FDistribution[' + DoF1 + ',' + DoF2 + ',x, true]]');
                ggbApplet.setLabelVisible('F', false);
                ggbApplet.setColor('F', 0, 0, 255);

                /* Create the points */
                ggbApplet.evalCommand('A=(' + a + ',F(' + a + '))');
                ggbApplet.setColor('A', 255, 0, 0);
                ggbApplet.setFixed('A', true);
                ggbApplet.setLabelVisible('A', false);
                ggbApplet.evalCommand('B=(' + b + ',F(' + b + '))');
                ggbApplet.setColor('B', 0, 0, 255);
                ggbApplet.setFixed('B', true);
                ggbApplet.setLabelVisible('B', false);

                /* Add some plot notes */
                var plotNotes = '\\[ \\color{red}{(' + chopDecimals(a, 3) + ',C_F(' + chopDecimals(a, 3) + '|' + DoF1 + ',' + DoF2 + '))} \\quad';
                plotNotes += '\\color{blue}{(' + chopDecimals(b, 3) + ',C_F(' + chopDecimals(b, 3) + '|' + DoF1 + ',' + DoF2 + '))} \\]';
                document.getElementById('plot_notes').innerHTML = plotNotes;

            } catch (err) {
                console.log('Error creating GGB Applet: ' + err);
            }

        }
    },

    /* Log Normal Distribution */
    logNormal: {
        displayName: 'Log-normal',
        description: 'The Log-normal distribution (a.k.a. the Galton distribution) is closely related to the Normal (Gaussian) distribution. There are some important differences to keep in mind. First, for the Log-normal stochastic variable, we can only observe positive values (zero is not positive) where Normal stochastic variable allows for positive, negative and zero. Second, the stochastic process underlying the Log-normal distribution relates to multiplication and the examination of growth rates. Thus, the sample geometric mean is the better estimate of the location parameter ($\\mu$) than the sample arithmetic mean. If <i>X</i> has a Log-normal distribution and we define $Y=\\log\\left(X\\right)$, then <i>Y</i> has a Normal Distribution. Important to note is that "log" ("common log") is not $\\log_{10}$ as you would find in pre-calculus or calculus classes. Rather "common log" in Statistics is $\\log_{e}$ or ln. </br></br> The Rate of Change (PDF) function for Log-normal situations is defined as $$LN\\left(x|\\mu,\\sigma\\right)=\\frac{1}{x\\sigma\\sqrt[2]{2\\pi}}\\text{exp}\\left(-\\frac{\\left(\\log x-\\mu\\right)^2}{2(\\sigma)^2}\\right)$$ where $\\mu$ is the location parameter and $\\sigma$ is the shape parameter.</br></br>The cumulative probability function (CPF/CDF) for a Log-normal situation is defined as $$C_{LN}\\left(x|\\mu,\\sigma\\right)=\\int_0^xLN\\left(t|\\mu,\\sigma\\right)\\cdot dt$$ When a stochastic variable follows a log-normal distribution, we will write $X\\sim \\mathcal{LOGN}(\\mu,\\sigma)$.',
        params: {
            mu: {
                paramId: 'mu',
                paramName: 'Location ($\\mu$)',
                paramValue: 1
            },
            sigma: {
                paramId: 'sigma',
                paramName: 'Shape ($\\sigma$)',
                paramValue: 2
            },
            a: {
                paramId: 'a',
                paramName: 'Lower Limit',
                paramValue: 10
            },
            b: {
                paramId: 'b',
                paramName: 'Upper Limit',
                paramValue: 20
            }
        },
        outputLabel: 'The Cumulative Probability of [Upper Limit] or smaller value',

        computeProbability: function () {
            /* First get values */
            try {
                var a = this.params.a.paramValue;
                a = Parser.eval(a);
                var b = this.params.b.paramValue;
                b = Parser.eval(b);
                var mu = this.params.mu.paramValue;
                mu = Parser.eval(mu);
                var sigma = this.params.sigma.paramValue;
                sigma = Parser.eval(sigma);
            } catch (err) {
                return 'Your input is invalid.';
            }

            /* Add restrictions on input. NEIL - YOU MAY WANT TO ADD SOME RESTRICTIONS */
            if ((b < a) || a < 0 || b < 0) {
                return 'Make sure your that your lower limit is not greater than your upper limit, and that both are non-negative.';
            }
            // Now we try returning output, including plot. Use try-catch to catch errors.
            try {
                var HTMLout = '\\[ \\int\\limits_{' + chopDecimals(a, 3) + '}^{' + chopDecimals(b, 3) + '} \\frac{1}{x\\cdot' + chopDecimals(sigma, 3) + '\\cdot \\sqrt{2\\pi }}';
                HTMLout += 'exp\\left(-\\frac{(\\log t -' + chopDecimals(mu, 3) + ')^2}{2\\cdot' + chopDecimals(sigma, 3) + '^2}\\right) \\, dt = ';
                HTMLout += (jStat.lognormal.cdf(b, mu, sigma) - jStat.lognormal.cdf(a, mu, sigma)).toFixed(decimals) + '\\]';
                /*Generate Plot*/
                ggbApplet.reset();
                document.getElementById('plot_wrapper').style.display = 'block';
                this.plot(mu, sigma, a, b);
                /*Return HTMLout - JaX code*/
                return HTMLout;
            } catch (err) {
                return 'Your input is invalid.';
            }
        },

        plot: function (mu, sigma, a, b) {
            try {
                /* Set Coords */
                ggbApplet.setCoordSystem(-b / 10, 1.3 * b, -0.2, 1.2);
                /* Create Curve */
                ggbApplet.evalCommand('L(x)=If[x>=0,LogNormal[' + mu + ',' + sigma + ',x,true]]');
                ggbApplet.setLabelVisible('L', false);
                ggbApplet.setColor('L', 0, 0, 255);
                /* Create Points*/
                ggbApplet.evalCommand('A=(' + a + ',L(' + a + '))');
                ggbApplet.setColor('A', 255, 0, 0);
                ggbApplet.setFixed('A', true);
                ggbApplet.setLabelVisible('A', false);
                ggbApplet.evalCommand('B=(' + b + ',L(' + b + '))');
                ggbApplet.setColor('B', 0, 0, 255);
                ggbApplet.setFixed('B', true);
                ggbApplet.setLabelVisible('B', false);

                /* Add plot notes */
                var plotNotes = '\\[\\color{red}{(' + a + ',C_{\\log}(' + chopDecimals(a, 3) + '|' + chopDecimals(mu, 3) + ',' + chopDecimals(sigma, 3) + '))} \\quad';
                plotNotes += '\\color{blue}{(' + b + ',C_{\\log}(' + chopDecimals(b, 3) + '|' + chopDecimals(mu, 3) + ',' + chopDecimals(sigma, 3) + '))}\\]';

                document.getElementById('plot_notes').innerHTML = plotNotes;

                return;
            } catch (err) {
                console.log('Error creating GGB Applet: ' + err);
            }
        }
    }
}




/* A few auxillary functions */
/* This function takes a number x, checks if it has N or less decimals points. If it does, return it. If not, chop decimals past N */
function chopDecimals(x, N) {
    if (x * Math.pow(10, N) % 1 == 0) {
        return x;
    } else {
        return x.toFixed(N);
    }
}