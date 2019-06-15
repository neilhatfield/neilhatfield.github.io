statcalc.pages["about"] = {
	render: function(){
		return `
			<h1 class="pretty">About This App</h1>
			<p>This web application provides a cumulative probability calculator for various types of distributions. Additionally, there is a short blurb that presents some information about the named distribution, the definitions for the distribution function (CDF/CPF) and rate-of-change function (pdf/pmf), and an example of using distribution shorthand notation.</p>
				<p>Instructions for using this application:</p>
				<ol>
				<li>Select the desired distribution type from the side bar.</li>
				<li>Enter the appropriate parameter values in the marked boxes.</li>
				<li>Enter the values you're using to define your event space. NOTE: the application provides cumulative probability values and is set to make use of both a lower and an upper bound to the data event. You'll need to enter your values accordingly.</li>
				<li>Press "Compute Probability" to get the corresponding cumulative probability value and to see a graphical representation.</li>
				</ol>
				<p>Keep in mind that the standard convention in Statistics when graphing distributions functions (a.k.a. CDFs or CPFs) is to graph the function on the domain of all Reals, regardless of the actual domain of the stochastic variable.</p>
			<p>
				This page was coded by Grant Sander. Mathematical content written by Neil Hatfield. Built upon jStat, MathJax and JSXGraph.
			</p>
		`;
	}
}