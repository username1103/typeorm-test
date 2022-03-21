# Typeorm Test

1. Run `npm i` command
2. Run `docker-compose up` command
3. Run `npm test` command

---

PASS test/user.test.ts  
영속성 테스트

하나의 엔티티 대상 테스트

- ✓ 새로운 엔티티 생성 후, save시 기존 엔티티가 업데이트 되는가 (33 ms)
- ✓ 새로운 엔티티 생성 후, insert시 기존 엔티티가 업데이트 되는가 (20 ms)
- ✓ 다른 트랜잭션에서 새로운 엔티티 생성 후, 같은 엔티티를 select로 얻어온 경우, 엔티티는 서로 다른가 (33 ms)
- ✓ 같은 트랜잭션에서 새로운 엔티티 생성 후, 같은 엔티티를 select로 얻어온 경우, 엔티티는 서로 다른가 (27 ms)
  -> 같은 트랜잭션내에서 save시 insert, select가 호출되는데 다시 select하는 경우에도 다시 쿼리가 나감.
- ✓ 같은 트랜잭션에서 같은 select 쿼리를 날리는 경우, 가져온 엔티티는 서로 다른가 (35 ms)
  -> 1차 캐시가 존재하지 않음?
- 그 밖의 테스트: 따로 모아서 쿼리가 나가는 방식은 아닌것으로 보임. 쿼리 관련함수 호출시 마다 쿼리로그 생성.

연관관계 관련 테스트

- ✓ 연관된 객체 조회후 재조회시, 두 객체는 서로 같은가 (42 ms)
- ✓ cascade가 true이고 insert시 연관객체는 저장이 안되는가 (162 ms)
- ✓ cascade가 true이고 save시 연관객체가 자동으로 저장되는가 (169 ms)
- ✓ cascade가 true이고 연관객체 수정후 save시 연관객체가 자동으로 수정되는가 (204 ms)
- ✓ cascade = ["insert"]일때, save시 연관객체가 연쇄적으로 저장되는가 (196 ms)
- ✕ cascade가 ['remove']이고 remove시 연관객체가 삭제되는가 (186 ms) -> 왜.. 안되지

---
