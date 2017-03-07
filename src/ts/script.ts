import "js-polyfills";
import * as jQuery from "jquery";
(<any>window).jQuery = jQuery;
import * as Tether from 'tether';
(<any>window).Tether = Tether;
import "bootstrap";

import { HelloWorld } from './HelloWorld';

let world = new HelloWorld();
