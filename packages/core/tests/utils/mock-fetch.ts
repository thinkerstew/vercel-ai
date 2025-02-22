import { COMPLEX_HEADER } from '../../shared/utils';

export function mockFetchDataStream(chunks: string[]) {
  jest.spyOn(global, 'fetch').mockImplementation(async () => {
    function* generateChunks() {
      for (const chunk of chunks) {
        yield new TextEncoder().encode(chunk);
      }
    }

    const chunkGenerator = generateChunks();

    return {
      url: 'https://example.com/api/chat',
      ok: true,
      status: 200,
      headers: new Map<string, string>([
        [COMPLEX_HEADER, 'true'],
      ]) as any as Headers,
      bodyUsed: false,
      body: {
        getReader() {
          return {
            read() {
              return Promise.resolve(chunkGenerator.next());
            },
            releaseLock() {},
            cancel() {},
          };
        },
      },
    } as unknown as Response;
  });
}

export function mockFetchError({
  statusCode,
  errorMessage,
}: {
  statusCode: number;
  errorMessage: string;
}) {
  jest.spyOn(global, 'fetch').mockImplementation(async () => {
    return {
      url: 'https://example.com/api/chat',
      ok: false,
      status: statusCode,
      bodyUsed: false,
      body: {
        getReader() {
          return {
            read() {
              return Promise.resolve(errorMessage);
            },
            releaseLock() {},
            cancel() {},
          };
        },
      },
      text: () => Promise.resolve(errorMessage),
    } as unknown as Response;
  });
}
