function MailPile(){this.msgcache=[];this.searchcache=[];this.keybindings=[];this.commands=[];this.graphselected=[]}Number.prototype.pad=function(e){typeof e!="number"&&(e=2);var t=String(this);while(t.length<e)t="0"+t;return t};MailPile.prototype.keybindings_loadfromserver=function(){var e=this;this.json_get("help",{},function(e){console.log(e);for(key in e[0].result.commands)console.log(key)})};MailPile.prototype.add=function(){};MailPile.prototype.attach=function(){};MailPile.prototype.compose=function(){};MailPile.prototype.delete=function(){};MailPile.prototype.extract=function(){};MailPile.prototype.filter=function(){};MailPile.prototype.help=function(){};MailPile.prototype.load=function(){};MailPile.prototype.mail=function(){};MailPile.prototype.forward=function(){};MailPile.prototype.next=function(){};MailPile.prototype.order=function(){};MailPile.prototype.optimize=function(){};MailPile.prototype.previous=function(){};MailPile.prototype.print=function(){};MailPile.prototype.reply=function(){};MailPile.prototype.rescan=function(){};MailPile.prototype.gpgrecvkey=function(e){console.log("Fetching GPG key 0x"+e);mailpile.json_get("gpg recv_key",{},function(t){console.log("Fetch command execed for GPG key 0x"+e+", resulting in:");console.log(t)})};MailPile.prototype.gpglistkeys=function(){mailpile.json_get("gpg list",{},function(e){$("#content").append('<div class="dialog" id="gpgkeylist"></div>');for(k in e.results){key=e.results[k];$("#gpgkeylist").append("<li>Key: "+key.uids[0].replace("<","&lt;").replace(">","&gt;")+": "+key.pub.keyid+"</li>")}})};MailPile.prototype.search=function(e){var t=this;$("#qbox").val(e);this.json_get("search",{q:e},function(e){$("#results").length==0&&$("#content").prepend('<table id="results" class="results"><tbody></tbody></table>');$("#results tbody").empty();for(var n=0;n<e.results.length;n++){msg_info=e.results[n];msg_tags=e.results[n].tags;d=new Date(msg_info.date*1e3);zpymd=d.getFullYear()+"-"+(d.getMonth()+1).pad(2)+"-"+d.getDate().pad(2);ymd=d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();taghrefs=msg_tags.map(function(e){return"<a onclick=\"mailpile.search('\\"+e+"')\">"+e+"</a>"}).join(" ");tr=$('<tr class="result"></tr>');tr.addClass(n%2==0?"even":"odd");tr.append('<td class="checkbox"><input type="checkbox" name="msg_'+msg_info.id+'"/></td>');tr.append('<td class="from"><a href="'+msg_info.url+'">'+msg_info.from+"</a></td>");tr.append('<td class="subject"><a href="'+msg_info.url+'">'+msg_info.subject+"</a></td>");tr.append('<td class="tags">'+taghrefs+"</td>");tr.append('<td class="date"><a onclick="mailpile.search(\'date:'+ymd+"');\">"+zpymd+"</a></td>");$("#results tbody").append(tr)}t.loglines(e.chatter)})};MailPile.prototype.go=function(e){console.log("Going to ",e);window.location.href=e};MailPile.prototype.set=function(e,t){var n=this;this.json_get("set",{args:e+"="+t},function(e){e.status=="ok"?n.notice("Success: "+e.loglines[0]):e.status=="error"&&this.error(e.loglines[0])})};MailPile.prototype.tag=function(e,t){};MailPile.prototype.addtag=function(e){};MailPile.prototype.unset=function(){};MailPile.prototype.update=function(){};MailPile.prototype.view=function(e,t){var n=this;this.json_get("view",{idx:e,msgid:t},function(e){$("#results").length==0&&$("#content").prepend('<table id="results" class="results"><tbody></tbody></table>');$("#results").empty();$that.loglines(e.chatter)})};MailPile.prototype.json_get=function(e,t,n){var r;e=="view"?r="/="+t.idx+"/"+t.msgid+".json":r="/_/"+e+".json";$.getJSON(r,t,n)};MailPile.prototype.loglines=function(e){$("#loglines").empty();for(var t=0;t<e.length;t++)$("#loglines").append(e[t]+"\n")};MailPile.prototype.notice=function(e){console.log("NOTICE: "+e)};MailPile.prototype.error=function(e){console.log("ERROR: "+e)};MailPile.prototype.warning=function(e){console.log("WARNING: "+e)};MailPile.prototype.results_list=function(){$("#btn-display-list").addClass("navigation-on");$("#btn-display-graph").removeClass("navigation-on");$("#pile-graph").hide();$("#pile-results").show()};MailPile.prototype.graph_actionbuttons=function(){this.graphselected.length>=1?$("#btn-compose-message").show():$("#btn-compose-message").hide();this.graphselected.length>=2?$("#btn-found-group").show():$("#btn-found-group").hide()};MailPile.prototype.focus_search=function(){$("#qbox").focus();return!1};MailPile.prototype.results_graph=function(e){$("#btn-display-graph").addClass("navigation-on");$("#btn-display-list").removeClass("navigation-on");$("#pile-results").hide();$("#pile-graph").show();d3.json("/_/shownetwork.json?args="+e,function(e,t){t=t[0].result;console.log(t);var n=640,r=640,i=d3.layout.force().charge(-300).linkDistance(75).size([n,r]),s=d3.select("#pile-graph-canvas-svg");$("#pile-graph-canvas-svg").empty();var o=d3.scale.category20(),u=d3.select("body").append("div").style("position","absolute").style("z-index","10").style("visibility","hidden").text("a simple tooltip");i.nodes(t.nodes).links(t.links).start();var a=s.selectAll(".link").data(t.links).enter().append("line").attr("class","link").style("stroke-width",function(e){return Math.sqrt(3*e.value)}),f=s.selectAll(".node").data(t.nodes).enter().append("g").attr("class","node").call(i.drag);f.append("circle").attr("r",8).style("fill",function(e){return o("#3a6b8c")});f.append("text").attr("x",12).attr("dy","0.35em").style("opacity","0.3").text(function(e){return e.email});a.append("text").attr("x",12).attr("dy",".35em").text(function(e){return e.type});f.on("click",function(e,t,n){if(mailpile.graphselected.indexOf(e.email)<0){d3.select(f[n][t]).selectAll("circle").style("fill","#4b7945");mailpile.graphselected.push(e.email)}else{mailpile.graphselected.pop(e.email);d3.select(f[n][t]).selectAll("circle").style("fill","#3a6b8c")}mailpile.graph_actionbuttons()});f.on("mouseover",function(e,t,n){d3.select(f[n][t]).selectAll("text").style("opacity","1")});f.on("mouseout",function(e,t,n){d3.select(f[n][t]).selectAll("text").style("opacity","0.3")});i.on("tick",function(){a.attr("x1",function(e){return e.source.x}).attr("y1",function(e){return e.source.y}).attr("x2",function(e){return e.target.x}).attr("y2",function(e){return e.target.y});f.attr("transform",function(e){return"translate("+e.x+","+e.y+")"})})})};var keybindings=[["/","normal",function(){$("#qbox").focus();return!1}],["C","normal",function(){mailpile.go("/_/compose/")}],["g i","normal",function(){mailpile.go("/Inbox/")}],["g c","normal",function(){mailpile.go("/_/contact/list/")}],["g n c","normal",function(){mailpile.go("/_/contact/add/")}],["g n m","normal",function(){mailpile.go("/_/compose/")}],["g t","normal",function(){$("#dialog_tag").show();$("#dialog_tag_input").focus();return!1}],["esc","global",function(){$("#dialog_tag_input").blur();$("#qbox").blur();$("#dialog_tag").hide()}]],mailpile=new MailPile;$(document).ready(function(){function n(e){var t=document.getElementById(e);t.focus();if(t.setSelectionRange){var n=2*t.value.length;t.setSelectionRange(n,n)}else t.value=t.value}function r(e){console.log(e);return e.id?"<span class='icon-user'></span> &nbsp;"+e.text:e.text}function i(e){var t="<table class='movie-result'><tr>";e.posters!==undefined&&e.posters.thumbnail!==undefined&&(t+="<td class='movie-image'><img src='"+e.posters.thumbnail+"'/></td>");t+="<td class='movie-info'><div class='movie-title'>"+e.title+"</div>";e.critics_consensus!==undefined?t+="<div class='movie-synopsis'>"+e.critics_consensus+"</div>":e.synopsis!==undefined&&(t+="<div class='movie-synopsis'>"+e.synopsis+"</div>");t+="</td></tr></table>";return t}function s(e){return e.title}$("#search-params, #bulk-actions").hide();$("#qbox").bind("focus",function(e){$("#search-params").slideDown("fast")});$("#qbox").bind("blur",function(e){$("#search-params").slideUp("fast")});for(item in keybindings)item[1]=="global"?Mousetrap.bindGlobal(item[0],item[2]):Mousetrap.bind(item[0],item[2]);$(".bulk-action").on("click",function(e){e.preventDefault();var t=$("#pile-results input[type=checkbox]"),n=$(this).attr("href"),r=0;$.each(t,function(){if($(this).val()==="selected"){console.log("This is here "+$(this).attr("name"));r++}});alert(r+' items selected to "'+n.replace("#","")+'"')});var e=function(e){$("#bulk-actions-selected-count").html(parseInt($("#bulk-actions-selected-count").html())+1);$("#bulk-actions").slideDown("fast");e.removeClass("result").addClass("result-on").data("state","selected").find("td.checkbox input[type=checkbox]").val("selected").prop("checked",!0)},t=function(e){var t=parseInt($("#bulk-actions-selected-count").html())-1;$("#bulk-actions-selected-count").html(t);t<1&&$("#bulk-actions").slideUp("fast");e.removeClass("result-on").addClass("result").data("state","normal").find("td.checkbox input[type=checkbox]").val("normal").prop("checked",!1)};$("#pile-results").on("click","tr",function(){$(this).data("state")==="selected"?t($(this)):e($(this))});$("#compose-to, #compose-cc, #compose-bcc").select2({ajax:{url:"http://localhost:33411/static/contacts.json",dataType:"json",results:function(e,t){console.log(e[0].result.contacts);return e[0].result.contacts}},multiple:!0,allowClear:!0,placeholder:"type name or email address",width:"94%",maximumSelectionSize:50,tokenSeparators:[","," - "],formatResult:r,formatSelection:r,formatSelectionTooBig:function(){return'You have added the max number of contacts allowed, to increase go to <a href="#">settings</a>'}});$("#compose-to, #compose-cc, #compose-bcc").on("change",function(){$("#compose-to_val").html($("#compose-to").val())});$("#compose-to, #compose-cc, #compose-bcc").select2("container").find("ul.select2-choices").sortable({containment:"parent",start:function(){$("#compose-to, #compose-cc, #compose-bcc").select2("onSortStart")},update:function(){$("#compose-to, #compose-cc, #compose-bcc").select2("onSortEnd")}});console.log("Wheeee here");$("#form-compose").bind("submit",function(e){e.preventDefault();$.ajax({url:"/api/0/message/compose/",type:"POST",data:$("#form-compose").serialize(),dataType:"json",success:function(e){console.log("Hellooo AJAX town");console.log(e)}})})});