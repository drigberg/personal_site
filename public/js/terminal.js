var themeColors = {
    codingSkills : ["#11DAFF","#1B9CFF"],
    otherSkills : ["#2CFF00","#17A600"],
    help : ["#FF3B0D", "#FF0D4E"]
}

var customCommands = {
    "codingSkills" : function(term) {
        var divCount = 0;
        term.echo("type any skill from the list for its description", {
            finalize: function(div) {
                divCount += 1;
                div.css("color", themeColors.codingSkills[1]);
            }
        });
        for (var n = 0; n < allSkills.length; n++) {
            var color;
            if (allSkills[n].type == "coding") {
                term.echo(allSkills[n].name, {
                    finalize: function(div) {
                        if (color == themeColors.codingSkills[0]) {
                            color = themeColors.codingSkills[1];
                        } else {
                            color = themeColors.codingSkills[0];
                        };
                        divCount += 1;
                        div.css("color", color);
                    }
                });
            };
        };
    },
    "otherSkills" : function(term) {
        var divCount = 0;
        term.echo("type any skill from the list for its description", {
            finalize: function(div) {
                divCount += 1;
                div.css("color", themeColors.otherSkills[1]);
            }
        });
        for (var n = 0; n < allSkills.length; n++) {
            var color;
            if (allSkills[n].type == "other") {
                term.echo(allSkills[n].name, {
                    finalize: function(div) {
                        if (color == themeColors.otherSkills[0]) {
                            color = themeColors.otherSkills[1];
                        } else {
                            color = themeColors.otherSkills[0];
                        };
                        divCount += 1;
                        div.css("color", color);
                    }
                });
            };
        };
    },
    "help" : function(term) {
        //term echo callbacks happen after for loop is finished; n can't be used for indexing
        var divCount = 0;
        for (var n = 0; n < helpMessages.length; n++) {
            var color;
            term.echo(helpMessages[n].text, {
                finalize: function(div) {
                    if (color == themeColors.help[0]) {
                        color = themeColors.help[1];
                    } else {
                        color = themeColors.help[0];
                    };
                    divCount += 1;
                    div.css("color", color);
                }
            });
        };
    }
};

function help(){
    return "INSTRUCTIONS GO HERE\nAND HERE\nAND HERE";
};

$( "body" ).on('DOMSubtreeModified', "span", function() {
    var color = "#aaaaaa";
    if ($(this).html() == "codingSkills"){
        color = themeColors.codingSkills[0];
    } else if ($(this).html() == "otherSkills"){
        color = themeColors.otherSkills[0];
    } else if ($(this).html() == "help"){
        color = themeColors.help[0];
    } else {
        var isSkill = false;
        for (var n = 0; n < allSkills.length; n++) {
            if ($(this).html() == allSkills[n].name) {
                isSkill = allSkills[n].type;
                break;
            };
        };
        if (isSkill == "coding") {
            color = themeColors.codingSkills[0];
        } else if (isSkill == "other") {
            color = themeColors.otherSkills[0];
        };
    };
    $(this).css("color", color);
});

jQuery(function($, undefined) {
    $('#terminal').terminal(function(command, term) {
        if (command !== '') {
            try {
                if (command in customCommands){
                    customCommands[command](term);
                } else {
                    isSkill = false;
                    for (var n = 0; n < allSkills.length; n++) {
                        if (command == allSkills[n].name) {
                            isSkill = allSkills[n].type;
                            term.echo(allSkills[n].description, {
                                finalize: function(div) {
                                    var color = "#aaaaaa";
                                    if (isSkill == "coding") {
                                        color = themeColors.codingSkills[0];
                                    } else if (isSkill == "other") {
                                        color = themeColors.otherSkills[0];
                                    };
                                    div.css("color", color);
                                }
                            });
                            break;
                        }
                    };

                    if (!isSkill){
                        var result = window.eval(command);
                        if (result !== undefined) {
                            term.echo(new String(result));
                        };
                    };
                };
            } catch(e) {
                term.error(new String(e));
            }
        } else {
           term.echo('');
        }
    }, {
        greetings: 'Type "help"!\n\n',
        name: 'terminal',
        height: 400,
        prompt: 'js> '
    });
});

var allSkills = [
    {
        name : "Python",
        description : "Python is my language of choice when not working with web apps. My Terminal Battleship project was written in Python--go to the projects tab to check it out!",
        type : "coding"
    },
    {
        name : "Javascript",
        description : "Javascript is my favorite language most of the time, because objects are SO MUCH FUN!",
        type : "coding"
    },
    {
        name : "Node",
        description : "I have experience with building RESTful backends with Node, as well as realtime chat-like apps. Check out Liars Dice in the projects tab to see an application of the latter!",
        type : "coding"
    },
    {
        name : "Mocha",
        description : "I use Mocha as my test suite for Javascript--I prefer to have all of my code be test-driven. I also drink mochas, but mostly on Thursdays.",
        type : "coding"
    },
    {
        name : "unittest",
        description : "I prefer to have all of my code be test-driven, so I use unittest for my Python scripts.",
        type : "coding"
    },
    {
        name : "JQuery",
        description : "JQuery is an extremely popular Javascript library for interacting with HTML page elements.",
        type : "coding"
    },
    {
        name : "Django",
        description : "Django is a back-end web framework for Python.",
        type : "coding"
    },
    {
        name : "P5.js",
        description : "P5.js is the Javascript version of Processing, the Java-based language for simple code-based art. I used it for my constellation generator (the background of my horoscope site), particle demos, and the shifting gradient background of this website. Go to the projects tab to check them out!",
        type : "coding"
    },
    {
        name : "D3.js",
        description : "D3.js is a Javascript tool for data visualization. I'm using it in a blogging tool that I haven't published yet--stay tuned!",
        type : "coding"
    },
    {
        name : "git",
        description : "I always use version control. Always. ...Always always always.",
        type : "coding"
    },
    {
        name : "3D_Printing",
        description : "I code in OpenSCAD to make designs for 3D printers.",
        type : "coding"
    },
    {
        name : "Natural_language_processing",
        description : "I love grammar and building parsers, so it follows that I would love working with language processing. My horoscope generator site in the projects tab uses generative grammar to create pseudo-contextual paragraphs.",
        type : "other"
    },
    {
        name : "Statistics",
        description : "Statistics has always come naturally to me.",
        type : "other"
    },
    {
        name : "Calculus",
        description : "I'm familiar with calculus up through partial derivatives, and I'm always looking for a way to use it in my code. ...I just haven't found one yet.",
        type : "other"
    },
    {
        name : "Microsoft_Excel",
        description : "I graph most things in my personal and work lives and acted as the resident Excel expert at Nestio.",
        type : "other"
    },
    {
        name : "Spanish",
        description : "Spanish is a real language, and I have proven that I can survive in Spain with it, however barely!",
        type : "other"
    }
];

var helpMessages = [
    {
        text : 'type "codingSkills" to see only coding-related skills'
    },
    {
        text : 'type "otherSkills" to see othe related skills'
    },
    {
        text : 'type any skill from the list for its description'
    },
    {
        text : 'type "help" to see help again'
    }
];
