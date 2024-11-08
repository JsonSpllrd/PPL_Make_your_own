            function isDelimiter(char) {
                return [',', ';', '(', ')', '[', ']', '{', '}'].includes(char);
            }

            function isOperator(char) {
                return ['+', '-', '*', '/', '%', '>', '<', '='].includes(char);
            }

            function getOperatorName(char) {
                const operators = {
                    '+': 'plus_op', '-': 'minus_op', '*': 'multiply_op',
                    '/': 'divide_op', '>': 'greater_than', '<': 'less_than',
                    '=': 'equal_sign', '%': 'modulus_op'
                };
                return operators[char];
            }

            function getDelimiterName(char) {
                const delimiters = {
                    ',': 'comma', ';': 'semicolon', '(': 'open_parenthesis',
                    ')': 'close_parenthesis', '[': 'open_bracket', ']': 'close_bracket',
                    '{': 'open_brace', '}': 'close_brace'
                };
                return delimiters[char];
            }

            function isValidIdentifier(string) {
                return /^[^\d\W]\w*$/.test(string);
            }

            function getKeywordOrDatatypeName(string) {
                const keywords = new Set(["break", "case", "continue", "default", "do", "else", "enum",
                                          "extern", "for", "goto", "if", "return", "sizeof", "static",
                                          "struct", "switch", "typedef", "union", "while"]);
                const datatypes = new Set(["auto", "char", "const", "double", "float", "int", "long",
                                           "register", "short", "signed", "unsigned", "void", "volatile"]);

                if (keywords.has(string)) return "keyword";
                if (datatypes.has(string)) return "datatype";
                return null;
            }

            function isInteger(string) {
                return /^\d+$/.test(string);
            }

            function lexicalAnalyzer(inputText) {
                const tokens = [];
                const length = inputText.length;
                let left = 0;

                while (left < length) {
                    if (inputText[left] === '"') {
                        let right = left + 1;
                        while (right < length && inputText[right] !== '"') right++;
                        if (right < length) {
                            const lexeme = inputText.slice(left + 1, right);
                            tokens.push({ lexeme, token: "string_literal" });
                        }
                        left = right + 1;
                        continue;
                    }

                    let right = left;
                    while (right < length && !isDelimiter(inputText[right]) && !isOperator(inputText[right]) && inputText[right] !== ' ') {
                        right++;
                    }

                    if (left !== right) {
                        const lexeme = inputText.slice(left, right).trim();
                        const token = getKeywordOrDatatypeName(lexeme) ||
                                      (isInteger(lexeme) ? "int_literal" :
                                      isValidIdentifier(lexeme) ? "identifier" : "unidentified");
                        if (lexeme) tokens.push({ lexeme, token });
                        left = right;
                    } else {
                        if (isDelimiter(inputText[left])) {
                            tokens.push({ lexeme: inputText[left], token: getDelimiterName(inputText[left]) });
                        } else if (isOperator(inputText[left])) {
                            tokens.push({ lexeme: inputText[left], token: getOperatorName(inputText[left]) });
                        }
                        left++;
                    }

                    if (left < length && inputText[left] === ' ') left++;
                }

                return tokens;
            }

            function generateHTMLReport(tokens, inputText) {
                let html = `<h3>Lexical Analysis Report</h3>`;
                html += `<p><strong>Input Expression:</strong> <code>${inputText}</code></p>`;
                html += `<table><tr><th>Lexeme</th><th>Token</th></tr>`;
                if (tokens.length === 0) {
                    html += `<tr><td colspan="2">No tokens generated.</td></tr>`;
                } else {
                    for (const { lexeme, token } of tokens) {
                        html += `<tr><td>${lexeme}</td><td>${token}</td></tr>`;
                    }
                }
                html += `</table>`;
                return html;
            }

            function analyze() {
                const inputText = document.getElementById("inputText").value;
                const tokens = lexicalAnalyzer(inputText);
                document.getElementById("output").innerHTML = generateHTMLReport(tokens, inputText);
            }

            function clearOutput() {
                document.getElementById("output").innerHTML = "Cleared";
            }
