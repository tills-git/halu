// jQuery jdragdrop plugin. Oct 19 2011.
// Copyright (c) 2010 Fumito Ito (https://bitbucket.org/fumito_ito/jdragdrop)
// 
// This plugin provide drag & drop actions to div elements on iPhone or iPad.
// And it is converted from webkitdragdrop.js v1.0 (prototype.js plugin).
// 
// webkitdragdrop.js has following copyrights and informations.
// //////////////////////////////////////////////////////////////////////////////////////////////
// // webkitdragdrop.js v1.0, Mon May 15 2010                                                  //
// // Copyright (c) 2010 Tommaso Buvoli (http://www.tommasobuvoli.com)                         //
// // No Extra Libraries are required, simply download this file, add it to your pages!        //
// //                                                                                          //
// // To See this library in action, grab an ipad and head over to http://www.gotproject.com   //
// // webkitdragdrop is freely distributable under the terms of an MIT-style license.          //
// //////////////////////////////////////////////////////////////////////////////////////////////
// 
// jQuery jdragdrop plugin is freely distributable under the terms of an MIT License.

(function($){
    //Description
    // Droppable fire events when a draggable is dropped on them
    var jquery_droppable = function()
    {
        this.initialize = function()
        {
            this.droppables = [];
            this.droppableRegions = [];
        }

        this.add = function(root, instance_props)
        {
            root = $("#".concat(root))[0];
            var default_props = {accept : [], hoverClass : null, onDrop : function(){}, onOver : function(){}, onOut : function(){}};
            default_props = $.extend(default_props, instance_props || {});
            this.droppables.push({r : root, p : default_props}); 		
        }

        this.remove = function(root)
        {
            root = $("#".concat(root))[0];
            var d = this.droppables;
            var i = d.length;
            while(i--)
            {
                if(d[i].r == root)
                {
                    d[i] = null;
                    this.droppables = jQuery.grep(d, function(n, i){
                        return n == null ? false : true;
                    });
                    return true;
                }
            }
            return false;
        }

        //calculate position and size of all droppables

        this.prepare = function()
        {
            var d = this.droppables;
            var i = d.length;
            var dR = [];
            var r = null;

            while(i--)
            {
                r = d[i].r;			
                if(r.style.display != 'none')
                {
                    dR.push({i : i, size : {width : $(r).width(), height : $(r).height()}, offset : $(r).offset()})			
                }
            }

            this.droppableRegions = dR;
        }

        this.finalize = function(x,y,r,e)
        {
            var indices = this.isOver(x,y);
            var index = this.maxZIndex(indices);
            var over = this.process(index,r);
            if(over)
            {
                this.drop(index, r,e);
            }
            this.process(-1,r);
            return over;	
        }

        this.check = function(x,y,r)
        {
            var indices = this.isOver(x,y);
            var index = this.maxZIndex(indices);
            return this.process(index,r);		
        }

        this.isOver = function(x, y)
        {
            var dR = this.droppableRegions;
            var i = dR.length;
            var active = [];
            var r = 0;
            var maxX = 0;
            var minX = 0;
            var maxY = 0;
            var minY = 0;

            while(i--)
            {
                r = dR[i];

                minY = r.offset.top;
                maxY = minY + r.size.height;

                if((y > minY) && (y < maxY))
                {
                    minX = r.offset.left;
                    maxX = minX + r.size.width;

                    if((x > minX) && (x < maxX))
                    {
                        active.push(r.i);
                    }			
                }		
            }

            return active;	
        }

        this.maxZIndex = function(indices)
        {
            var d = this.droppables;
            var l = indices.length;
            var index = -1;

            var maxZ = -100000000;
            var curZ = 0;

            while(l--)
            {
                curZ = parseInt(d[indices[l]].r.style.zIndex || 0);
                if(curZ > maxZ)
                {
                    maxZ = curZ;
                    index = indices[l];		
                }	
            }

            return index;	
        }

        this.process = function(index, draggableRoot)
        {
            //only perform update if a change has occured
            if(this.lastIndex != index)
            {
                //remove previous
                if(this.lastIndex != null)
                {
                    var d = this.droppables[this.lastIndex]
                    var p = d.p;
                    var r = d.r;

                    if(p.hoverClass)
                    {
                        $(r).removeClass(p.hoverClass);
                    }
                    p.onOut();
                    this.lastIndex = null;
                    this.lastOutput = false;
                }

                //add new
                if(index != -1)
                {
                    var d = this.droppables[index]
                    var p = d.p;
                    var r = d.r;

                    if(this.hasClassNames(draggableRoot, p.accept))
                    {
                        if(p.hoverClass)
                        {
                            $(r).addClass(p.hoverClass);
                        }
                        p.onOver();				
                        this.lastIndex = index;
                        this.lastOutput = true;	
                    }
                }	
            }
            return this.lastOutput;
        }

        this.drop = function(index, r, e)
        {
            if(index != -1)
            {
                this.droppables[index].p.onDrop(r,e);
            }
        }

        this.hasClassNames = function(r, names)
        {
            var l = names.length;
            if(l == 0){return true}
            while(l--)
            {
                if($(r).hasClass(names[l]))
                {
                    return true;
                }
            }
            return false;
        }

        this.initialize();
    }

    //drop = new jquery_droppable();

    //Description
    //jquery_draggable - allows users to drag elements with their hands
    var jquery_draggable = function(r, ip)
    {
        this.initialize = function(root, instance_props)
        {
            this.root = $("#".concat(root))[0];
            var default_props = {scroll : false, revert : false, handle : this.root, zIndex : 1000, onStart : function(){}, onEnd : function(){}};		

            this.p = $.extend(default_props, instance_props || {});
            default_props.handle = typeof default_props.handle == 'string' ? $('#'.concat(default_props.handle))[0] : default_props.handle;
            this.prepare();
            this.bindEvents();
        }

        this.prepare = function()
        {
            var rs = this.root.style;

            //set position
            if($(this.root).css('position') != 'absolute')
            {
                rs.position = 'relative';
            }

            //set top, right, bottom, left
            rs.top = rs.top || '0px';
            rs.left = rs.left || '0px';
            rs.right = "";
            rs.bottom = "";		

            //set zindex;
            rs.zIndex = rs.zIndex || '0';
        }

        this.bindEvents = function()
        {
            var handle = this.p.handle;
            var self = this;

            handle.addEventListener("touchstart", function(event){self.touchStart(event);}, false);
            handle.addEventListener("touchmove", function(event){self.touchMove(event);}, false);
            handle.addEventListener("touchend", function(event){self.touchEnd(event);}, false);
        }	

        this.destroy = function()
        {
            var handle = this.p.handle;

            handle.removeEventListener("touchstart", this.ts);
            handle.removeEventListener("touchmove", this.tm);
            handle.removeEventListener("touchend", this.te);	
        }

        this.set = function(key, value)
        {
            this.p[key] = value;
        }

        this.touchStart = function(event)
        {
            //prepare needed variables
            var p = this.p;
            var r = this.root;
            var rs = r.style;
            var t = event.targetTouches[0];		

            //get position of touch
            touchX = t.pageX;
            touchY = t.pageY;

            //set base values for position of root
            rs.top = this.root.style.top || '0px';
            rs.left = this.root.style.left || '0px';
            rs.bottom = null;
            rs.right = null;

            var cp = this.getPosition();

            //save event properties
            p.rx = cp.x;
            p.ry = cp.y;		
            p.tx = touchX;
            p.ty = touchY;
            p.z = parseInt(this.root.style.zIndex);

            //boost zIndex
            rs.zIndex = p.zIndex;
            jquery_droppable_constants.droppables.prepare();
            p.onStart();
        }

        this.touchMove = function(event)
        {
            event.preventDefault();
            event.stopPropagation();

            //prepare needed variables
            var p = this.p;
            var r = this.root;
            var rs = r.style;
            var t = event.targetTouches[0];
            if(t == null){return}

            var curX = t.pageX;
            var curY = t.pageY;

            var delX = curX - p.tx;
            var delY = curY - p.ty;

            rs.left = p.rx + delX + 'px';
            rs.top  = p.ry + delY + 'px';

            //scroll window
            if(p.scroll)
            {
                s = this.getScroll(curX, curY);
                if((s[0] != 0) || (s[1] != 0))
                {
                    window.scrollTo(window.scrollX + s[0], window.scrollY + s[1]);
                }
            }

            //check droppables
            jquery_droppable_constants.droppables.check(curX, curY, r);

            //save position for touchEnd
            this.lastCurX = curX;
            this.lastCurY = curY;
        }

        this.touchEnd = function(event)
        {
            var r = this.root;
            var p = this.p;
            var dropped = jquery_droppable_constants.droppables.finalize(this.lastCurX, this.lastCurY, r, event);

            if(((p.revert) && (!dropped)) || (p.revert === 'always'))
            {
                //revert root
                var rs = r.style;
                rs.top = (p.ry + 'px');
                rs.left = (p.rx + 'px');
            }

            r.style.zIndex = this.p.z;
            this.p.onEnd();
        }

        this.getPosition = function()
        {
            var rs = this.root.style;
            return {x : parseInt(rs.left || 0), y : parseInt(rs.top  || 0)}
        }

        this.getScroll = function(pX, pY)
        {
            //read window variables
            var sX = window.scrollX;
            var sY = window.scrollY;

            var wX = window.innerWidth;
            var wY = window.innerHeight;

            //set contants		
            var scroll_amount = 10; //how many pixels to scroll
            var scroll_sensitivity = 100; //how many pixels from border to start scrolling from.

            var delX = 0;
            var delY = 0;		

            //process vertical y scroll
            if(pY - sY < scroll_sensitivity)
            {
                delY = -scroll_amount;
            }
            else
            if((sY + wY) - pY < scroll_sensitivity)
            {
                delY = scroll_amount;
            }

            //process horizontal x scroll
            if(pX - sX < scroll_sensitivity)
            {
                delX = -scroll_amount;
            }
            else
            if((sX + wX) - pX < scroll_sensitivity)
            {
                delX = scroll_amount;
            }

            return [delX, delY]
        }

        //contructor
        this.initialize(r, ip);
    }

    //Description
    //jquery_click manages click events for draggables
    var jquery_click = function(r, ip)
    {
        this.initialize = function(root, instance_props)
        {
            var default_props = {onClick : function(){}};

            this.root = $("#".concat(root))[0];
            this.p = $.extend(default_props, instance_props || {});
            this.bindEvents();
        }

        this.bindEvents = function()
        {
            var root = this.root;
            var self = this;

            //add Listeners
            root.addEventListener("touchstart", function(e){self.touchStart(e);}, false);
            root.addEventListener("touchmove", function(e){self.touchMove(e);}, false);
            root.addEventListener("touchend", function(e){self.touchEnd(e);}, false);

            this.bound = true;	
        }	

        this.touchStart = function()
        {
            var self = this;
            this.moved = false;
            if(this.bound == false)
            {
                this.root.addEventListener("touchmove", function(e){self.touchMove(e);}, false);
                this.bound = true;
            }
        }

        this.touchMove = function()
        {
            this.moved = true;
            this.root.removeEventListener("touchmove", function(e){self.touchMove(e);});
            this.bound = false;
        }

        this.touchEnd = function()
        {
            if(this.moved == false)
            {
                this.p.onClick();
            }
        }

        this.setEvent = function(f)
        {
            if(typeof(f) == 'function')
            {
                this.p.onClick = f;
            }
        }

        this.unbind = function()
        {
            var root = this.root;
            var self = this;
            root.removeEventListener("touchstart", function(e){self.touchStart(e);});
            root.removeEventListener("touchmove", function(e){self.touchMove(e);});
            root.removeEventListener("touchend", function(e){self.touchEnd(e);});
        }

        //call constructor
        this.initialize(r, ip);
    }
    
    var jquery_droppable_constants = 
    {
        droppables : new jquery_droppable()
    };

    
    $.fn.jDroppable = function(config){
        return this.each(function(){
            jquery_droppable_constants.droppables.add(this.id, config);
        });
    }
    $.fn.jDraggable = function(config){
        return this.each(function(){
           new jquery_draggable(this.id, config);
        });
    }
    $.fn.jClick = function(config){
        return this.each(function(){
            new jquery_click(this.id, config);
        });
    }
    
})(jQuery);
