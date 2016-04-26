//// VARIAVEIS GLOBAIS ////
var width = 800;
var height = 600;





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
	
	console.log(dadosAninhados);
	
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
		.attr("viewBox", "0 0 "+ 800 + " " + 600)//responsivo
		.attr("preserveAspectRatio", "xMidYMid meet");//responsivo =)
			
}


////////////////////////////////////
//// DESENHO DAS VISUALIZAÇÕES ////
//////////////////////////////////
function desenhaLineChart(data, container){
	var x = d3.time.scale()
			.range([0,width])
			.domain(d3.extent(data, function(d) {
				return d.key;
			}));
			
	var y = d3.scale.linear()
			.range([height,0])
			.domain([0,d3.max(data, function(d) {
				return d.values.length;
			})]);
	
	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");
		
	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");
	
	var line = d3.svg.line()
		.x(function(d){return x(d.key);}) //x representa o ano, pego pela var data
		.y(function(d){return y(d.values.length);}); // y representa o usuario
	
	var svg = d3.select(container)
		.select("svg");
		
	svg.append("g")
		.attr("class", "eixoX")
		.attr("transform", "translate(0," + (height-50) + ")")
      	.call(xAxis);
      	
    svg.append("g")
		.attr("class", "eixoY")
		.attr("transform", "translate(" + width + ", 0)")
      	.call(yAxis);
	
	svg.append("path")
		.datum(data)
		.attr("class", "line")
		.attr("d", line);
}

function main(dados) {
	criaLineChart(dados,"#container-line-chart");
	desenhaLineChart(dados,"#container-line-chart");
	
} // Fim do método main
