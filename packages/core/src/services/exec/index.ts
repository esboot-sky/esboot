import spawn from 'cross-spawn';
import { searchCommand } from '@@/helpers/path';
import { isWins } from '@@/constants';

export function runExec(args: any[]) {
  const command = args.slice(0, 1)[0];
  const params = args.slice(1);
  
  const childProcess = spawn(
    searchCommand(command),
    params,
    {
      /**
       * FIXME: 此处的处理有一些问题
       * 
       * 在mac上error使用inherit会导致子进程不退出，然后husky拦截不到报错，还能提交代码，所以手动监听了exit事件
       * 
       * 在wins上面用inherit子进程可以触发拦截，但是看不到报错信息了，所以用了pipe。
       */
      stdio: ['inherit', 'inherit', isWins ? 'inherit': 'pipe'],
      shell: true,
      cwd: process.cwd(),
    }
  );

  // macos监听不会触发这里，wins上一个已知的问题就是husky触发拦截的时候，error里面会有一个信息就是ENOEN。
  childProcess.on('error', (err) => {
    console.error(`Failed to start child process: ${err}`);
    process.exit(1);
  });

  if (!isWins) {
    let errorOutput = '';
    childProcess?.stderr?.on('data', (data) => {
      errorOutput += data.toString();
    });
    
    childProcess.on('exit', (code, signal) => {
      if (code !== 0) {
        console.error(errorOutput)
        console.error(`exec ${command} failed with code ${code}, signal ${signal}`);
        process.exit(1);
      }
    });
  }
}
