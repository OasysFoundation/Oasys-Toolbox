import math from "mathjs"


function latexFromString (equation) {
	const node = math.parse(equation)
	return node.toTex();
}

function symbolizer (equation) {
	const inputValue = equation;
	const simplifiedInputNode = math.simplify(inputValue);
	
	//var node = math.parse(simplifiedInput);
	
	// this is the tree of the equation
	simplifiedInputNode.traverse(function (node, path, parent) {
		var nodeValue = "";
		if (node.type == 'OperatorNode') {
			nodeValue = node.op;
		} else if (node.type == 'ConstantNode') {
			nodeValue = node.value;
		} else if (node.type == 'SymbolNode') {
			nodeValue = node.name;
		} else if (node.type == 'FunctionNode') {
			nodeValue = node.fn;
		}
	});
	return simplifiedInputNode;
};

export {latexFromString, symbolizer};
