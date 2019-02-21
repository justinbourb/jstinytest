/**
 * Very simple in-browser unit-test library, with zero deps.
 *
 * Background turns green if all tests pass, otherwise red.
 * Results appear in the DOM or you can view the JavaScript
 * console if you prefer.
 *
 * Example:
 *
 *   adder.js (code under test)
 *
 *     function add(a, b) {
 *       return a + b;
 *     }
 *
 *   adder-test.html (tests - just open a browser to see results)
 *
 *     <script src="jstinytest_dom_edition.js"></script>
 *     <script src="adder.js"></script>
 *     <script>
 *    /*tests calls TinyTest.run
 *     *@params takes an object of tests
 *     *individual tests then call eq which tests against assertStrictEquals
 *    /*
 *     tests({
 *
 *       'adds numbers': function() {
 *         eq(6, add(2, 4));
 *         eq(6.6, add(2.6, 4));
 *       },
 *
 *       'subtracts numbers': function() {
 *         eq(-2, add(2, -4));
 *       },
 *
 *     });
 *     </script>
 *
 *
 * That's it. Stop using over complicated frameworks that get in your way.
 *
 * -Justin Bourbonniere (jstintytest_modified)
 * MIT License. See https://github.com/justinbourb/jstinytest_dom_edition
 *
 * -Joe Walnes (jstinytest)
 * MIT License. See https://github.com/joewalnes/jstinytest/
 */
var TinyTest = {
    run: function(tests) {
        setTimeout(async function() {
            TinyTest.createHTML();
            // Give document a chance to complete
            if (window.document && document.body) {
                // define variables
                failingTestsDiv = document.getElementById('failingTestsDiv');
                passingTestsDiv = document.getElementById('passingTestsDiv');
                var failingTestCount = 0;
                var passingTestCount = 0;
                //run tests and print results
                await (async function () {
                    for (var testName in tests) {
                        //testAction calls individual tests in html file provided by user
                        var testAction = tests[testName];
                        try {
                            //applies this = TinyTest
                            await testAction.apply(this);
                            passingTestCount++;
                            console.log('Test passed:', testName);
                            //prints passing test to DOM
                            passingTestsDiv.innerHTML += '<ul>' + 'Test passed: ' + passingTestCount + ') ' + testName + '</ul>';
                        //if testAction throws an error (test fails)
                        } catch (e) {
                            failingTestCount++;
                            console.error(e.stack);
                            //formats Test and Error onto their own lines and prints it in the DOM 
                            failingTestsDiv.innerHTML += '<ul style="list-style: none;"> Test failed: ' + failingTestCount + ') ' + testName + '<li>' + e.stack + '</li>' + '</ul>';
                        }
                    }
                    //print total passing and total failues to top of screen (h3 element)
                    document.getElementById('results').innerHTML='Passing Tests: '+
                    passingTestCount + '&nbsp&nbsp&nbsp&nbsp&nbsp||&nbsp&nbsp&nbsp&nbsp&nbsp Failing Tests: ' +
                    failingTestCount;

                    //change background color as needed
                    if (failingTestCount === 0){
                       passingTestsDiv.style.backgroundColor = '#07a507';
                       failingTestsDiv.style.display = 'none';
                       document.getElementById('reverseButton').style.display = 'none';
                     } else {
                       failingTestsDiv.style.background = 'rgb(121, 0, 0)';
                       failingTestsDiv.style.color = 'rgb(255, 239, 239)';
                       failingTestsDiv.style.fontSize = '1em';
                       failingTestsDiv.style.border = '2px solid #ef9999';
                      if (passingTestCount === 0) {
                        passingTestsDiv.style.display = 'none'; 
                        document.getElementById('reverseButton').style.display = 'none';
                      } else {
                        passingTestsDiv.style.color = '#07a507';
                      }
                    } 
                })()
            }
        }, 0);
    },

    fail: function(msg) {
        throw new Error('fail(): ' + msg);
    },

    assert: function(value, msg) {
        if (!value) {
            throw new Error('assert(): ' + msg);
        }
    },

    assertEquals: function(expected, actual) {
        if (expected != actual) {
            throw new Error('assertEquals() "' + expected + '" != "' + actual + '"');
        }
    },

    assertStrictEquals: function(expected, actual) {
        if (expected !== actual) {
            throw new Error('assertStrictEquals() "' + expected + '" !== "' + actual + '"');
        }
    },
    
    createHTML: function() {
      /*HTML template for whatever html file the end user supplies
      *this is useful so the end user just needs to add their Tests
      *and not worry about HTML
      */
      var htmlElement = document.getElementsByTagName('HTML')[0];
      var testFileHTML = `
        <style>
            #container{
                width: 100%;
                margin: 0;
                padding: 0;
                display:flex;
            }
            body{
                background: black;
            }
            button, h3{
                display:inline-block;
            }
            button{
                margin-left:2em;
            }
            #passingTestsDiv {
                border: 2px solid green;
                position: relative;
                word-wrap:break-word;
                display: flex;
                flex-direction: column;
                font-family: arial;
            }
            #results{
                color: white;
            }
            #failingTestsDiv {
                border: 2px solid red;
                position: relative;
                word-wrap:break-word;
                display: flex;
                flex-direction: column;
                font-family: arial;
            }
        </style>
        <body>
            <h3 id="results">Tests running... please wait...</h3>
            <button type="button" id="reverseButton" onclick="TinyTest.reverseDisplayOrder()">Reverse Display Order</button>
            <div id="container" style="flex-direction:column;">
                <div id="failingTestsDiv"></div>
                <br>
                <div id="passingTestsDiv"></div>
            </div>
        </body>
        `
        htmlElement.innerHTML += testFileHTML;
  },
  reverseDisplayOrder: function() {
    //reverses the display order of passing and failing tests (which one is on top)
    if (document.getElementById('container').style.flexDirection==="column") {
      document.getElementById('container').style.flexDirection="column-reverse";
    } else {
      document.getElementById('container').style.flexDirection="column";
    }

  }

};

var fail               = TinyTest.fail.bind(TinyTest);
var assert             = TinyTest.assert.bind(TinyTest);
var assertEquals       = TinyTest.assertEquals.bind(TinyTest);
var eq                 = TinyTest.assertStrictEquals.bind(TinyTest);
var tests              = TinyTest.run.bind(TinyTest);
var failingTestsDiv;
var passingTestsDiv;
