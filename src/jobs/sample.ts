const main = async () => {
  console.info('sample job written by typescript')
}

;(async () => {
  await main()
})()

export {}
