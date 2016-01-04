export class ReplyFactory {
	static create(type) {
		switch (type) {
			case 'PONG':
				return new PongReply();
		}
	}
}

export class Reply {

}

export class PongReply extends Reply {

}
