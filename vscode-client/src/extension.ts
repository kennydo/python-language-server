/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';

import * as net from 'net';

import { workspace, Disposable, ExtensionContext } from 'vscode';
import { LanguageClient, LanguageClientOptions, SettingMonitor, ServerOptions, ErrorAction, ErrorHandler, CloseAction, TransportKind } from 'vscode-languageclient';

function startLangServer(command: string, args: string[], documentSelector: string[]): Disposable {
	const serverOptions: ServerOptions = {
        command,
        args,
	};
	const clientOptions: LanguageClientOptions = {
		documentSelector: documentSelector,
        synchronize: {
            configurationSection: "pyls"
        }
	}
	return new LanguageClient(command, serverOptions, clientOptions).start();
}

function startLangServerTCP(addr: number, documentSelector: string[]): Disposable {
	const serverOptions: ServerOptions = function() {
		return new Promise((resolve, reject) => {
			var client = new net.Socket();
			client.connect(addr, process.env.PYLS_HOST, function() {
				resolve({
					reader: client,
					writer: client
				});
			});
		});
	}

	const clientOptions: LanguageClientOptions = {
		documentSelector: documentSelector,
	}
	return new LanguageClient(`tcp lang server (port ${addr})`, serverOptions, clientOptions).start();
}

export function activate(context: ExtensionContext) {
    //context.subscriptions.push(startLangServer("pyls", ["-vv"], ["python"]));
    // For TCP server needs to be started seperately
    context.subscriptions.push(startLangServerTCP(process.env.PYLS_PORT, ["python"]));
}

