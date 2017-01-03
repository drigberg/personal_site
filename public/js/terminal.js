var themeColors = {
    skills : ["#11DAFF","#1B9CFF"],
    help : ["#FF3B0D", "#FF0D4E"]
}

var customCommands = {
    "skills" : function(term) {
        var divCount = 0;
        term.echo("type any skill from the list for its description", {
            finalize: function(div) {
                divCount += 1;
                div.css("color", themeColors.skills[1]);
            }
        });
        for (var n = 0; n < allSkills.length; n++) {
            var color;
            term.echo(allSkills[n].name, {
                finalize: function(div) {
                    if (color == themeColors.skills[0]) {
                        color = themeColors.skills[1];
                    } else {
                        color = themeColors.skills[0];
                    };
                    divCount += 1;
                    div.css("color", color);
                }
            });
        };
    },
    "codingSkills" : function(term) {
        var divCount = 0;
        term.echo("type any skill from the list for its description", {
            finalize: function(div) {
                divCount += 1;
                div.css("color", themeColors.skills[1]);
            }
        });
        for (var n = 0; n < allSkills.length; n++) {
            var color;
            if (allSkills[n].type == "coding") {
                term.echo(allSkills[n].name, {
                    finalize: function(div) {
                        if (color == themeColors.skills[0]) {
                            color = themeColors.skills[1];
                        } else {
                            color = themeColors.skills[0];
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
    if ($(this).html() == "skills"){
        $(this).css("color", themeColors.skills[0]);
    } else if ($(this).html() == "help"){
        $(this).css("color", themeColors.help[0]);
    } else {
        $(this).css("color", "#aaaaaa");
    }
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
                            isSkill = true;
                            term.echo(allSkills[n].description, {
                                finalize: function(div) {
                                    var color = themeColors.skills[0];
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
        greetings: 'Here are some of the skills and topics that I have been working on!\nType "help" for help.',
        name: 'terminal',
        height: 400,
        prompt: 'js> '
    });
});

var allSkills = [
    {
        name : "P5.js",
        description : "P5.js is the Javascript version of Processing, the Java-based language for simple code-based art.",
        type : "coding"
    },
    {
        name : "D3.js",
        description : "D3.js is a Javascript tool for data visualization.",
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
        name : "Conversational Spanish",
        description : "Spanish is a real language. Wow!",
        type : "other"
    }
];

var helpMessages = [
    {
        text : 'type "skills" to see all skills'
    },
    {
        text : 'type "codingSkills" to see only coding-related skills'
    },
    {
        text : 'type any skill from the list for its description'
    },
    {
        text : 'type "help" to see help again'
    }
];
