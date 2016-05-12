//// VARIAVEIS GLOBAIS ////
var margin = {top:20,right:20,bottom:30,left:50};
var width = 960-margin.left-margin.right;
var height = 500-margin.top-margin.bottom;



//////////////////////////////////////
//// PRÉ PROCESSAMENTO DOS DADOS ////
////////////////////////////////////
d3.json("data/tweets.json", function(error, data){
	
	var dados = data.tweets;
	var formataData = d3.time.format("%m-%d-%Y");
	
	dados.forEach(function(d){
		d.timestamp = formataData.parse(d.timestamp);
	});
	
	var dadosAninhados = d3.nest()
		.key(function (d) {return d.timestamp.getFullYear();})
		.entries(dados); 

	//console.log(dadosAninhados);
	
	//pq eh assincrono neh
	main(dadosAninhados);
	
});

////////////////////////////////////
//// CRIAÇÃO DAS VISUALIZAÇÕES ////
//////////////////////////////////
function criaLineChart(dados, container) {
	//nao preciso de uma variavel, pois so sera usado uma vez, apenas para criar o container
	//var svg;
	
	d3.select(container)
		.append("svg")
		//.attr("width",800) nao precisa quando tem o valor responsivo
		//.attr("height",600)
		.attr("viewBox", "0 0 "+(width+margin.left+margin.right) +" "+(height+margin.top+margin.bottom))//responsivo
		.attr("preserveAspectRatio", "xMidYMid meet")//responsivo =)
		.append("g")
    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");	
}

function criaBarChart(dados, container) {
	//nao preciso de uma variavel, pois so sera usado uma vez, apenas para criar o container
	//var svg;
	
	var svg = d3.select(container)
		.append("svg")
		//.attr("width",800) nao precisa quando tem o valor responsivo
		//.attr("height",600)
		.attr("viewBox", "0 0 "+(width+margin.left+margin.right) +" "+(height+margin.top+margin.bottom))//responsivo
		.attr("preserveAspectRatio", "xMidYMid meet")//responsivo =)
		.append("g")
    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    	
    svg.selectAll("rect")
    	.data(dados)
    	.enter()
    	.append("rect");
    		
}


////////////////////////////////////
//// DESENHO DAS VISUALIZAÇÕES ////
//////////////////////////////////
function desenhaLineChart(data, container){
	var x = d3.time.scale()
			.range([0,width])
			.domain(d3.extent(data, function(d) {
				//console.log(d.key);
				return new Date(d.key);
				
			}));
			
			
			
	teste = d3.min(data, function(d) {
				return d.values.length;
		});
		
		
		//console.log(teste);
			
	var y = d3.scale.linear()
			.range([height,0])
			.domain([0, d3.max(data, function(d) {
				return +d.values.length;
			})]);
	
	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom")
		.ticks(d3.time.year,1);
		
	var yAxis = d3.svg.axis()
		.scale(y)	
		.orient("left");
	
	var line = d3.svg.line()
			//eh legal mas nao eh bom :( deforma os dados
			//.interpolate("basis")
		.x(function(d){return x(new Date(d.key));}) //x representa o ano, pego pela var data
		.y(function(d){return y(d.values.length);}); // y representa o usuario
	
	var svg = d3.select(container)
		.select("svg g");
		
	svg.append("g")
		.attr("class", "x eixo")
		.attr("transform", "translate(0," + (height) + ")")
      	.call(xAxis);
      	
    svg.append("g")
		.attr("class", "y eixo")
		//.attr("transform", "translate(" + width + ", 0)")
      	.call(yAxis);
	
	svg.append("path")
		.datum(data)
		.attr("class", "line")
		.attr("d", line);
}

function desenhaBarChart(data, container){

	var x = d3.scale.ordinal()
    		.rangeRoundBands([0, width], .1)
			.domain(data.map(function(d) { 
				return d.key; 
			}));
			
	//console.log(x.domain());
	
	var y = d3.scale.linear()
			.range([height,0])
			.domain([0, d3.max(data, function(d) {
				return +d.values.length;
			})]);
	
	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom")
		.ticks(10);
		
	var yAxis = d3.svg.axis()
		.scale(y)	
		.orient("left");
	
	var svg = d3.select(container)
		.select("svg g");
		
	svg.append("g")
		.attr("class", "x eixo")
		.attr("transform","translate(0,"+height+")")
		.call(xAxis);
		
	svg.append("g")
		.attr("class", "y eixo")
		.call(yAxis);
	
	svg.selectAll("rect")
		.attr("class","barra")
		.attr("x",function(d) { return x(d.key); })
		.attr("y",function(d) { return y(d.values.length); })
		.attr("width", x.rangeBand())
		.attr("height", function(d) { return height - y(d.values.length); });
}

function criaScatterplotChart(data,container){
	var svg = d3.select(container)
		.append("svg")
			.attr("viewBox", "0 0 "+(width+margin.left+margin.right) +" "+(height+margin.top+margin.bottom))//responsivo
			.attr("preserveAspectRatio", "xMidYMid meet")//responsivo =)
		.append("g")
    		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    svg.selectAll("circle")
    	.data(data)
    	.enter()
    	.append("circle");
}

function desenhaScatterplotChart(data,container){
	//ordinal pq se trata dos anos, que sao dados discretos
	var x = d3.scale.ordinal()
    		.rangeRoundBands([0, width], .1)
			.domain(data.map(function(d) { 
				return d.key; 
			}));
	
	//linear pq se trata de quantidade, que sao dados continuos
	var y = d3.scale.linear()
			.range([height,0])
			.domain([0, d3.max(data, function(d) {
				//converte para inteiro a contangem dos valores no vetor
				//que representa a quantidade de tweets por ano
				return +d.values.length;
			})]);
		
	var xAxis = d3.svg.axis()
				.scale(x)
				.orient("bottom");
	
	var yAxis = d3.svg.axis()
				.scale(y)
				.orient("left");
				//.ticks(10);
	
	var svg = d3.select(container).select("svg g");
		
	svg.append("g")
		.attr("class", "x eixo")
		.attr("transform","translate(0,"+height+")")
		.call(xAxis);
		
	svg.append("g")
		.attr("class", "y eixo")
		.call(yAxis);
		
	svg.selectAll("circle")
		.attr("class", "ponto")
		.attr("r", function(d) { return d.values.length*5; })
		.attr("cx", function(d) { return x(d.key) ; })
		.attr("cy", function(d) { return y(d.values.length); });		
		
}

function main(dados) {
	criaLineChart(dados,"#container-line-chart");
	desenhaLineChart(dados,"#container-line-chart");
	criaBarChart(dados,"#container-bar-chart");
	desenhaBarChart(dados,"#container-bar-chart");
	criaScatterplotChart(dados,"#container-scatterplot-chart");
	desenhaScatterplotChart(dados,"#container-scatterplot-chart");
	
} // Fim do método main
